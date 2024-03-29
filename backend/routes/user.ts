import { Hono } from 'hono';

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode,sign,verify} from 'hono/jwt'
import { signinInput, signupInput } from '@harshtyagi_003/meduim-common';


export const userRouter = new Hono<{
    Bindings:{
      DATABASE_URL:string
      JWT_SECRET:string
    },
    Variables : {
          userId: string
    }
  }>();

  userRouter.post("/signin",async (c)=>{

    
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    
     const body=await c.req.json();
     const {success}=signupInput.safeParse(body)
     if(!success){
      c.status(404)
      return c.text('Incorrect inputs');
     }
     const res=await prisma.user.findUnique({
      where:{
        email:body.email,
        password:body.password
  
      }
     })
     if(!res){
     c.status(403);
     return c.json({
      error:"Wrong credentials"
      
      
     })
     }
     const token=await sign({id:res?.id},c.env.JWT_SECRET);
     return c.json({
      jwt:token
     })
   
  })
  userRouter.post('/signup',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body=await c.req.json();
  const {success}=signupInput.safeParse(body)
     if(!success){
      c.status(404)
      return c.text('Incorrect inputs');
     }
  const res=await prisma.user.create({
    data:{
      email:body.email,
      password:body.password,
      name:body.name
  
    }
  })
     const token=await sign({id:res.id},c.env.JWT_SECRET);
     
  
    return c.json({
    jwt:token
    });
  })
  