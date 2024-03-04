import { NextRequest, NextResponse } from 'next/server'

type ResponseData = {
  message: string
}

export const GET = (req: NextRequest, res: NextResponse<ResponseData>) => {
    return NextResponse.json({ message: 'Hello from Next.js!' }, { status: 200 })
}
