import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function product(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "POST") {
        const { name, price, description, image } = req.body;
        try {
            const newProduct = await prisma.product.create({
                data: {
                    name,
                    price,
                    description,
                    image,
                },
            });

            res
                .status(201)
                .json({ message: "Product created successfully", product: newProduct });
        } catch (error) {
            console.error("Error creating product:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else if (req.method === "GET") {
        try {
            const products = await prisma.product.findMany();
            res.status(200).json({ products });
        } catch (error) {
            console.error("Error getting products:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else if (req.method === "PUT") {
        const { id, name, price, description, image } = req.body;
        try {
            const updatedProduct = await prisma.product.update({
                where: { id: id },
                data: {
                    name,
                    price,
                    description,
                    image,
                },
            });

            res.status(201).json({
                message: "Product updated successfully",
                product: updatedProduct,
            });
        } catch (error) {
            console.error("Error updating product:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else if (req.method === "DELETE") {
        const id = req.query.id as string; // Get the id from the query parameters
        try {
            const deletedProduct = await prisma.product.delete({
                where: { id: parseInt(id) }, // Parse the id as an integer
            });

            res.status(201).json({
                message: "Product deleted successfully",
                product: deletedProduct,
            });
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
