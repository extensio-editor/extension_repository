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

    const extension = prisma.extension.findUnique({
      where: {id: queryParams.get("id")!},
      include: {
        developer: {
          select: {name: true}
        }
      }
    })

    return NextResponse.json(extension, { status: 200 })
}
