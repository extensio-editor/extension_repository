import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/../lib/prisma';

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
