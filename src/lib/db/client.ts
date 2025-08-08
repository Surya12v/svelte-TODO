import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sveltedb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
export async function createTable() {
    const sql = `
            CREATE TABLE IF NOT EXISTS todolist (
            id VARCHAR(36) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            date DATETIME NOT NULL,
            dueDate DATETIME,
            image VARCHAR(255),
            description TEXT,
            completed BOOLEAN NOT NULL DEFAULT 0,
            createdAt DATETIME NOT NULL,
            updatedAt DATETIME
        );
    `;
    try {
        const connection = await db.getConnection();
        await connection.query(sql);
        connection.release();
    } catch (error) {
        console.error('Error creating table:', error);
        throw error;
    }
}

try {
    await createTable();
    if(!db) {
        console.error('Database connection failed');
    }
    console.log('Database connection established and table created successfully');
} catch (error) {
    console.error('Error creating table:', error);
}