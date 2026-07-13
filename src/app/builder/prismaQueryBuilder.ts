export class PrismaQueryBuilder {
    public where: Record<string, any> = {};
    public orderBy: Record<string, unknown> = {};
    public skip = 0;
    public take = 10;

    public page = 1;
    public limit = 10;

    constructor(
        private query: Record<string, unknown>
    ) { }

    paginate() {
        const page = Math.max(Number(this.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(this.query.limit) || 10, 1),
            100
        );
        this.page = page;
        this.skip = (page - 1) * limit;
        this.take = limit;

        return this;
    }

    sort(sortableFields: string[]) {
        let sortBy = (this.query.sortBy as string) || "createdAt";

        const sortOrder =
            (this.query.sortOrder as "asc" | "desc") || "desc";

        if (!sortableFields.includes(sortBy)) {
            sortBy = "createdAt";
        }

        this.orderBy = {
            [sortBy]: sortOrder,
        };

        return this;
    }

    search(searchableFields: string[]) {
        const search = this.query.search as string;

        if (search) {
            this.where.OR = searchableFields.map((field) => ({
                [field]: {
                    contains: search,
                    mode: "insensitive",
                },
            }));
        }

        return this;
    }

    filter(filterableFields: string[]) {
        filterableFields.forEach((field) => {
            const value = this.query[field];

            if (value !== undefined) {
                this.where[field] = value;
            }
        });

        return this;
    }

    priceRange(field = "monthlyRent") {
        const min = Number(this.query.minRent);
        const max = Number(this.query.maxRent);

        if (!isNaN(min) || !isNaN(max)) {
            this.where[field] = {};

            if (!isNaN(min)) {
                this.where[field].gte = min;
            }

            if (!isNaN(max)) {
                this.where[field].lte = max;
            }
        }

        return this;
    }
}