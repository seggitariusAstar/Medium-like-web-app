import { Hono } from 'hono';
import { decode,sign,verify } from 'hono/jwt';
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
export const blogRouter = new Hono<{
    Bindings:{
      DATABASE_URL:string
      JWT_SECRET:string
    },
    Variables : {
          userId: string
    }
  }>();
  blogRouter.use("/*",async (c,next)=>{
    const jwt= c.req.header('Authorization');
    if(!jwt){
      c.status(401);
      return c.json({
        error:"No access to this route"
      })
    }
    const token=jwt.split(' ')[1];
   
   try{ const payload=await verify(token,c.env.JWT_SECRET);
    if(!payload){
      c.status(401);
      return c.json({
        error:"Unauthorized"
      })
    }
    c.set('userId',payload.id);
    await next()
  }catch(e){
    c.status(401);
      return c.json({
        error:"Unauthorized"
      })
  }
       
       
  })

 blogRouter.post("/",async (c)=>{
  const userId=c.get('userId')
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL	,
}).$extends(withAccelerate());
const body=await c.req.json();
 const res=await prisma.post.create({
    data:{
        title:body.title,
        content:body.content,
        authorId:userId
    }
 })
 return c.json({
    id:res.id
 })


  })
 blogRouter.put("/",async (c)=>{
    const userId=c.get('userId')
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
    const body=await c.req.json();
    await prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content
		}
	});
     return c.text('Blog updated successfullky')
  })
  blogRouter.get("/bulk",async (c)=>{
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const posts = await prisma.post.findMany();

	return c.json(posts);
})
  
 blogRouter.get("/:id",async (c)=>{
    const id= c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());
    const res=await prisma.post.findFirst({
        where:{
            id:id
        }
    })
    if(!res){
        return c.text("No such kind of blog available");

    }
    return c.json(res);
})
 




  