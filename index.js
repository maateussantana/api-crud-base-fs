const express = require("express");
const sqlite = require("sqlite3").verbose();

const app = express();
const port = 3000;
const db = new sqlite.Database("database.db");

db.serialize(() => {
		db.run(
				`CREATE TABLE IF NOT EXISTS users (
						id INTEGER PRIMARY KEY AUTOINCREMENT, 
						username TEXT, 
						password TEXT, 
						cpf TEXT, 
						telefone TEXT, 
						email TEXT
				)`
		);

		db.run("ALTER TABLE users ADD COLUMN cpf TEXT", (err) => {
				if (err && err.message.includes("duplicate column name")) {
						console.log("Coluna 'cpf' já existe");
				}
		});
		db.run("ALTER TABLE users ADD COLUMN telefone TEXT", (err) => {
				if (err && err.message.includes("duplicate column name")) {
						console.log("Coluna 'telefone' já existe");
				}
		});
		db.run("ALTER TABLE users ADD COLUMN email TEXT", (err) => {
				if (err && err.message.includes("duplicate column name")) {
						console.log("Coluna 'email' já existe");
				}
		});

		// Criar a tabela de professores
		db.run(
				`CREATE TABLE IF NOT EXISTS professores (
						id INTEGER PRIMARY KEY AUTOINCREMENT, 
						nome TEXT, 
						disciplina TEXT, 
						email TEXT, 
						telefone TEXT
				)`
		);
});

app.use(express.json());

app.get("/", (req, res) => {
		res.send("Estou na minha API");
});

// CRUD para usuários
app.get("/users", (req, res) => {
		db.all("SELECT * FROM users", (error, rows) => {
				if (error) {
						res.status(500).send(error.message);
						return;
				}
				res.status(200).json(rows);
		});
});

app.get("/users/:id", (req, res) => {
		const id = req.params.id;
		db.get("SELECT * FROM users WHERE id = ?", [id], (error, row) => {
				if (error) {
						res.status(500).send(error.message);
						return;
				}
				if (!row) {
						res.status(404).send("User not found");
						return;
				}
				res.status(200).json(row);
		});
});

app.post("/users", (req, res) => {
		const { username, password, cpf, telefone, email } = req.body;

		if (!username || !password || !cpf || !telefone || !email) {
				res.status(400).send("Dados incompletos");
				return;
		}

		db.run(
				"INSERT INTO users (username, password, cpf, telefone, email) VALUES (?, ?, ?, ?, ?)",
				[username, password, cpf, telefone, email],
				function (error) {
						if (error) {
								res.status(500).send(error.message);
								return;
						}
						res.status(201).send(`Usuário ${username} cadastrado com sucesso`);
				}
		);
});

app.put("/users/:id", (req, res) => {
		const id = req.params.id;
		const { username, password, cpf, telefone, email } = req.body;

		if (!username || !password || !cpf || !telefone || !email) {
				res.status(400).send("Dados incompletos");
				return;
		}

		db.run(
				"UPDATE users SET username = ?, password = ?, cpf = ?, telefone = ?, email = ? WHERE id = ?",
				[username, password, cpf, telefone, email, id],
				function (error) {
						if (error) {
								res.status(500).send(error.message);
								return;
						}
						if (this.changes === 0) {
								res.status(404).send("User not found");
								return;
						}
						res.status(200).send(`Usuário ${username} atualizado com sucesso`);
				}
		);
});

app.patch("/users/:id", (req, res) => {
		const id = req.params.id;
		const { username, password, cpf, telefone, email } = req.body;

		if (!username || !password || !cpf || !telefone || !email) {
				res.status(400).send("Dados incompletos");
				return;
		}

		db.run(
				"UPDATE users SET username = ?, password = ?, cpf = ?, telefone = ?, email = ? WHERE id = ?",
				[username, password, cpf, telefone, email, id],
				function (error) {
						if (error) {
								res.status(500).send(error.message);
								return;
						}
						if (this.changes === 0) {
								res.status(404).send("User not found");
								return;
						}
						res.status(200).send(`Usuário ${username} atualizado com sucesso`);
				}
		);
});

app.delete("/users/:id", (req, res) => {
		const id = req.params.id;
		db.run("DELETE FROM users WHERE id = ?", [id], function (error) {
				if (error) {
						res.status(500).send(error.message);
						return;
				}
				if (this.changes === 0) {
						res.status(404).send("User not found");
						return;
				}
				res.status(200).send(`Usuário ${id} deletado com sucesso`);
		});
});

// CRUD para professores
app.get("/professores", (req, res) => {
		db.all("SELECT * FROM professores", (error, rows) => {
				if (error) {
						res.status(500).send(error.message);
						return;
				}
				res.status(200).json(rows);
		});
});

app.get("/professores/:id", (req, res) => {
		const id = req.params.id;
		db.get("SELECT * FROM professores WHERE id = ?", [id], (error, row) => {
				if (error) {
						res.status(500).send(error.message);
						return;
				}
				if (!row) {
						res.status(404).send("Professor not found");
						return;
				}
				res.status(200).json(row);
		});
});

app.post("/professores", (req, res) => {
		const { nome, disciplina, email, telefone } = req.body;

		if (!nome || !disciplina || !email || !telefone) {
				res.status(400).send("Dados incompletos");
				return;
		}

		db.run(
				"INSERT INTO professores (nome, disciplina, email, telefone) VALUES (?, ?, ?, ?)",
				[nome, disciplina, email, telefone],
				function (error) {
						if (error) {
								res.status(500).send(error.message);
								return;
						}
						res.status(201).send(`Professor ${nome} cadastrado com sucesso`);
				}
		);
});

app.put("/professores/:id", (req, res) => {
		const id = req.params.id;
		const { nome, disciplina, email, telefone } = req.body;

		if (!nome || !disciplina || !email || !telefone) {
				res.status(400).send("Dados incompletos");
				return;
		}

		db.run(
				"UPDATE professores SET nome = ?, disciplina = ?, email = ?, telefone = ? WHERE id = ?",
				[nome, disciplina, email, telefone, id],
				function (error) {
						if (error) {
								res.status(500).send(error.message);
								return;
						}
						if (this.changes === 0) {
								res.status(404).send("Professor not found");
								return;
						}
						res.status(200).send(`Professor ${nome} atualizado com sucesso`);
				}
		);
});

app.patch("/professores/:id", (req, res) => {
		const id = req.params.id;
		const { nome, disciplina, email, telefone } = req.body;

		if (!nome && !disciplina && !email && !telefone) {
				res.status(400).send("Nada para atualizar");
				return;
		}

		const updates = [];
		const params = [];

		if (nome) {
				updates.push("nome = ?");
				params.push(nome);
		}
		if (disciplina) {
				updates.push("disciplina = ?");
				params.push(disciplina);
		}
		if (email) {
				updates.push("email = ?");
				params.push(email);
		}
		if (telefone) {
				updates.push("telefone = ?");
				params.push(telefone);
		}

		params.push(id);

		const sql = `UPDATE professores SET ${updates.join(", ")} WHERE id = ?`;

		db.run(sql, params, function (error) {
				if (error) {
						res.status(500).send(error.message);
						return;
				}
				if (this.changes === 0) {
						res.status(404).send("Professor not found");
						return;
				}
				res.status(200).send(`Professor atualizado com sucesso`);
		});
});

app.delete("/professores/:id", (req, res) => {
		const id = req.params.id;
		db.run("DELETE FROM professores WHERE id = ?", [id], function (error) {
				if (error) {
						res.status(500).send(error.message);
						return;
				}
				if (this.changes === 0) {
						res.status(404).send("Professor not found");
						return;
				}
				res.status(200).send(`Professor ${id} deletado com sucesso`);
		});
});

app.listen(port, () => {
		console.log(`Servidor rodando na porta ${port}`);
});


