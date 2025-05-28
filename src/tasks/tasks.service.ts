import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';

@Injectable()
export class TasksService {

  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>){}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();

  }

  async findAll(): Promise<Task[]> {

    return this.taskModel.find().exec();

  }

  async findOne(id: string): Promise<Task> {

    if(!isValidObjectId(id)) throw new NotFoundException('Task does not exist');

    const task = await this.taskModel.findById(id);

    if(!task) throw new NotFoundException("Task does not exist");

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {

    if(!isValidObjectId(id)) throw new NotFoundException('Task does not exist');

    const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
        new: true,
        runValidators: true
    });

    if(!task) throw new NotFoundException("Task does not exist");

    return task;
  }

  async remove(id: string): Promise<Task> {

    if(!isValidObjectId(id)) throw new NotFoundException('Task does not exist');

    const task = await this.taskModel.findByIdAndDelete(id)

    if(!task) throw new NotFoundException("Task does not exist");

    return task;
  }
}
