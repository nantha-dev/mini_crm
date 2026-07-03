CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO contacts (name, email, phone, company) VALUES
('Alice Johnson', 'alice@example.com', '+1 234 567 8901', 'TechCorp'),
('Bob Smith', 'bob@example.com', '+1 345 678 9012', 'DesignStudio'),
('Carol White', 'carol@example.com', '+1 456 789 0123', 'FinanceHub');