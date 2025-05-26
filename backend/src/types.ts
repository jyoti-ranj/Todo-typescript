import zod from 'zod'

export const todoSchema = zod.object({
    title: zod.string(),
    description : zod.string()
})

export const updateTodo = zod.object({
    id: zod.string()
});
export const deleteTodo = zod.object({
    id: zod.string()
})
