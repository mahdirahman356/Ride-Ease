/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { Query, RootFilterQuery } from "mongoose";
import { excludeField } from "../../constants";

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public readonly query: Record<string, string>

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query
    }

    filter(): this {
        const filter: Record<string, any> = { ...this.query }

        for (const field of excludeField) {
            delete filter[field]
        }

        console.log(filter.createdAt)
        if (filter.createdAt) {
            const dateString = filter.createdAt;
            const startOfDay = new Date(dateString);

            const endOfDay = new Date(startOfDay);
            endOfDay.setDate(startOfDay.getDate() + 1);

            filter.createdAt = {
                $gte: startOfDay,
                $lt: endOfDay
            };
        }

        this.modelQuery = this.modelQuery.find(filter)
        return this
    }

    search(searchableField: string[]) {
        const searchTerm = this.query.searchTerm || ""

        const searchQuery = {
            $or: searchableField.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }
            ))
        }

        this.modelQuery = this.modelQuery.find(searchQuery)
        return this
    }

    sort(): this {
        const sort = this.query.sort || "-createdAt"

        this.modelQuery = this.modelQuery.sort(sort)
        return this


    }

    fields(): this {
        const fields = this.query.fields?.split(",").join(" ") || ""

        if (fields) {
            this.modelQuery = this.modelQuery.select(fields)
        }
        return this

    }

    paginate(): this {
        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 10
        const skip = (page - 1) * limit

        this.modelQuery = this.modelQuery.skip(skip).limit(limit)
        return this


    }

    build() {
        return this.modelQuery
    }

    async getMeta(filter?: RootFilterQuery<any> | undefined) {
        const totalDocuments = await this.modelQuery.model.countDocuments(filter)

        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 10

        const totalPage = Math.ceil(totalDocuments / limit)
        return { page, limit, total: totalDocuments, totalPage }

    }
}