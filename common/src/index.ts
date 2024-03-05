import z from "zod";

export const signupInput=z.object({
    email:z.string().email(),
    password:z.string().min(6),
    name:z.string().optional()

})



export const signinInput=z.object({
    email:z.string().email(),
    password:z.string().min(6)
})


export const createBlogInput=z.object({
    title:z.string(),
    content:z.string()
})



export const updateBlog=z.object({
    title:z.string(),
    content:z.string(),
    id:z.string()//we can change it to number if we want to
})


export type SignupInput=z.infer<typeof signupInput>
export type SigninInput=z.infer<typeof signinInput>
export type CreateBlogInput=z.infer<typeof createBlogInput>
export type UpdateBlog=z.infer<typeof updateBlog>