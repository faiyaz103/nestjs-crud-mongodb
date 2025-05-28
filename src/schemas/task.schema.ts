import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({timestamps:{createdAt:true}})
export class Task {

    @Prop({required: true, unique:true})
    title: string;

    @Prop({required:true})
    description: string

    @Prop({
        enum: ['Pending', 'InProgress', 'Completed'],
        default: 'Pending'
    })
    status: string

    @Prop({
        required:true,
        validate:{
            validator: (value: Date) => value > new Date(),
            message: "dueDate has to be a future date."
        },
    })
    dueDate: Date;
}
export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);