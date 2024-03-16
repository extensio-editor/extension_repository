import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/../lib/prisma';
import { getServerSession } from "next-auth/next"
import authOptions from '@/../lib/auth';

type ResponseData = {
  message: string
}

export const GET = (req: NextRequest, res: NextResponse<ResponseData>) => {
    const queryParams = new URLSearchParams(req.nextUrl.search);

    if(!queryParams.has("id")) {
      return NextResponse.json({ message: 'Missing "id" parameter!' }, { status: 400 })
    }

    return prisma.extension.findUnique({
      where: {id: queryParams.get("id")!},
      include: {
        developer: {
          select: {name: true}
        }
      }
    }).then((extension) => {
      if (!extension) {
        return NextResponse.json({ message: "Couldnt find extension with id " + queryParams.get("id")}, { status: 404 })
      }
  
      return NextResponse.json(extension, { status: 200 })
    })
}

export const POST = async (req: NextRequest, res: NextResponse<ResponseData>) => {
  // Make sure the user is logged in.
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Session not found, are you logged in?" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {email: session["user"]!["email"]!},
    select: {
      id: true,
      extensions: true,
      name: true,
    }
  })

  if (!user) {
    return NextResponse.json({ message: "Couldn't find user, even tho could find session. This is most likely an issue on our end." }, { status: 500 });
  }

  // Verify all required data has been provided
  // Required fields: name, gitUrl
  const body = await req.formData();
  if(!body.has("name") || !body.has("gitUrl")) {
    return NextResponse.json({ message: "Missing parameter. Required parameters are 'name' & 'gitUrl'" }, { status: 400 });
  }

  // Validate the extension name
  // Extention name can not contain "/" because it will be used to split between users.
  // Extension name can also not contain any url unsafe characters.
  let extensionName = body.get("name")! as string;
  extensionName = encodeURIComponent(extensionName);

  // Remove .git from url if that was added
  let extensionGitUrl = body.get("gitUrl")! as string;
  if (extensionGitUrl.endsWith(".git")) extensionGitUrl = extensionGitUrl.slice(0,-4);
  if (extensionGitUrl.endsWith(".git/")) extensionGitUrl = extensionGitUrl.slice(0,-5);

  // Check if there is not already an extension registered for the same url
  const sameUrlExtension = await prisma.extension.findFirst({
    where: {gitUrl: extensionGitUrl as string},
    select: {
      id: true
    }
  })

  if (sameUrlExtension) return NextResponse.json({ message: `There already is an extension for this url! It has id ${sameUrlExtension.id}` }, { status: 409 })

  // Check if there is already an extension by that name
  // If there is rename it to be [username]/[name]
  // If the user already has an extension with the same name refuse it.
  const existingExtention = await prisma.extension.findFirst({
    where: {name: extensionName},
    select: {
      developerId: true,
    }
  })

  if(existingExtention) {
    if (existingExtention.developerId == user.id) {
      return NextResponse.json({ message: "Can only have one extention with name per user!" }, { status: 405 });
    } else {
      extensionName = encodeURIComponent(user.name!);
    }
  }

  try {
    const extension = await prisma.extension.create({
      data: {
        name: extensionName,
        gitUrl: extensionGitUrl,
        developer: {
          connect: {
            id: user.id
          }
        }
      }
    });

    prisma.user.update({
      where: { id: user.id },
      data: {
        extensions: {
          set: [...user.extensions, extension]
        }
      }
    });

    return NextResponse.redirect(`${req.nextUrl.protocol}//${req.nextUrl.host}/api/v1/extension?id=${extension.id}`, {status: 301});
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong! " + error }, { status: 500 });
  }
}
