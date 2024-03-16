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
      extensions: true
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

  try {
    const extension = await prisma.extension.create({
      data: {
        name: body.get("name")! as string,
        gitUrl: body.get("gitUrl")! as string,
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

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong! " + error }, { status: 500 });
  }
}
