import zod from 'zod'

const todoSchema = zod.object({
    title: zod.string(),
    description : zod.string()
})

export default todoSchema