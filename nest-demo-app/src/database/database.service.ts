import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Model, Document, FilterQuery } from 'mongoose';

@Injectable()
export class DatabaseService {
  getRefreshModel<T extends Document>(model: Model<T>) {
    return new RefreshModel(model);
  }
}

export class RefreshModel<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  private get modelName() {
    return this.model.modelName.toLowerCase();
  }

  private get collectionName() {
    return this.model.collection.collectionName;
  }

  async createDocument(field: object): Promise<T> {
    const newDoc = new this.model(field);
    try {
      await newDoc.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not add the ${this.modelName} to database.`,
      );
    }
    return newDoc;
  }

  async findAllDocuments(): Promise<T[]> {
    let allDocs: T[];
    try {
      allDocs = await this.model.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not find all ${this.collectionName} from datebase.`,
      );
    }
    return allDocs;
  }

  async findDocumentById(id: string): Promise<T> {
    let doc: T;
    try {
      doc = await this.model.findById(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not find the ${this.modelName} from datebase.`,
      );
    }
    if (!doc) {
      throw new NotFoundException(`The ${this.modelName} doesn't exist.`);
    }
    return doc;
  }

  async findDocumentByField(field: FilterQuery<T>): Promise<T> {
    let doc: T;
    try {
      doc = await this.model.findOne(field);
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not find the ${this.modelName} from datebase.`,
      );
    }
    if (!doc) {
      throw new NotFoundException(`The ${this.modelName} doesn't exist.`);
    }
    return doc;
  }

  async updateDocument(doc: T, field: FilterQuery<T>): Promise<T> {
    Object.keys(field).forEach((key) => (doc[key] = field[key]));
    try {
      await doc.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not update the ${this.modelName}.`,
      );
    }
    return doc;
  }

  async findAndUpdateDocument(
    find_field: FilterQuery<T>,
    update_field: FilterQuery<T>,
  ): Promise<T> {
    const doc = await this.findDocumentByField(find_field);
    const updatedDoc = await this.updateDocument(doc, update_field);
    return updatedDoc;
  }

  async removeDocumentKeys(doc: T, keys: (keyof T)[]): Promise<T> {
    const field: Partial<{ [k in keyof T]: 1 }> = {};
    keys.forEach((key) => (field[key] = 1));
    try {
      await this.model.updateOne({ _id: doc._id }, { $unset: field }).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not remove items of ${this.modelName} from database.`,
      );
    }
    return doc;
  }

  async deleteDocumentById(id: string): Promise<T> {
    let deletedDoc: T;
    try {
      deletedDoc = await this.model.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not delete ${this.modelName} from datebase.`,
      );
    }
    if (!deletedDoc) {
      throw new NotFoundException(
        `Could not delete the ${this.modelName}. The ${this.modelName} doesn't exist.`,
      );
    }
    return deletedDoc;
  }

  async validateDocument(doc: T, field: FilterQuery<T>): Promise<void> {
    Object.keys(field).forEach((key) => {
      if (doc[key] !== field[key]) {
        throw new BadRequestException(`Invalid ${this.convertCamelCase(key)}.`);
      }
    });
  }

  async blockDuplicate(field: FilterQuery<T>): Promise<void> {
    // Checking the field, throw error if the field already exists.
    const key = Object.keys(field)[0];
    const isFieldExist = await this.isFieldExist(field);
    if (isFieldExist) {
      const doc = await this.findDocumentByField(field);
      if (doc) {
        throw new BadRequestException(
          `${this.convertCamelCase(key)} already exists.`,
        );
      }
    }
  }

  async isIdExist(id: string): Promise<boolean> {
    let doc: T;
    try {
      doc = await this.model.findById(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not check the existence for id from datebase.`,
      );
    }
    return doc ? true : false;
  }

  async isFieldExist(field: FilterQuery<T>): Promise<boolean> {
    const key = Object.keys(field)[0];
    let doc: T;
    try {
      doc = await this.model.findOne(field).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not check the existence for ${this.convertCamelCase(
          key,
        )} from datebase.`,
      );
    }
    return doc ? true : false;
  }

  private convertCamelCase(str: string): string {
    return str
      .split('')
      .map((char) => (char.toUpperCase() === char ? ' ' + char : char))
      .map((char, index) => (index === 0 ? char.toUpperCase() : char))
      .reduce((prev, current) => prev + current, '');
  }
}
