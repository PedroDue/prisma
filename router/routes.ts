import {Router} from "express"
import {prisma} from "../database/prismaClient";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = Router();

//lista usuários cadastrados
router.get('/api/user', async (req, res, next) => {

    try {
        const users = await prisma.user.findMany();

        res.status(200).send(users)

        next()

    } catch (err) {
        res.status(500).send({message: 'Ouve um problema no servidor, tente mais tarde'})
    }
})

//pega usuário por id
router.get('/api/user/:id', async (req, res, next) => {
    try {
        const {id} = req.params
        const user = await prisma.user.findUnique({
            where: {id: String(id)}
        })
        if (user) {
            res.status(200).send(user)
        }else {
            res.status(404).send({message: 'funcionario não encontrado ou inexistente'})
        }
        console.log(user)
        next()

    } catch (erro) {
        res.status(500).send({message: 'erro servidor'})
    }
})

//cadastra novo usuário
router.post('/api/user/cadastro', async (req, res, next) => {

    try {
        const {name, email, password, confirmPassword} = req.body

        //verifica se email existe
        const emailExist = await prisma.user.findUnique({where: {email: email}})

        if (password !== confirmPassword) {
            res.status(422).send({message: "as senhas não conferem"})
        } else if (emailExist) {
            res.status(422).send({message: "Email já cadastrado, utilize outro"})
        } else {
            //cria senha
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            //cria usuário
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: passwordHash
                }
            });

            res.status(200).send({message: 'usuário cadastrado'})

        }

        next()

    } catch (erro) {
        res.status(500).send({message: 'erro servidor'})
        console.log(erro)
    }
})

//login
router.post('/api/user/login', async (req, res, next) => {
    try {
        const {email, password} = req.body

        //checa se usuário existe
        const user = await prisma.user.findUnique({where: {email: email}})

        if (user) {
            res.status(200)
        } else {
            res.status(404).send({message: "Usuário não encontrado"})
        }

        //checa se senha é válida e gera token
        // @ts-ignore
        const passwordCadastrada = user.password

        const checkPassword = await bcrypt.compare(password, passwordCadastrada)

        if (!checkPassword) {
            res.status(422).send({message: "senha inválida"})
        } else {

            // @ts-ignore
            const token = jwt.sign({id: user.id}, process.env.SECRET);

            // @ts-ignore
            res.status(200).send({message: "usuário logado e eutenticado com sucesso", token})
        }

        next()

    } catch (err) {
        console.log(err)
        res.status(500).send({message: 'erro no servidor'})
    }
})

router.post('/api/cadastro-funcionario', async (req, res, next) => {
    try {

        const {nome, idade, cargo} = req.body
        await prisma.funcionario.create({
            data: {
                nome,
                idade,
                cargo
            }
        });

        res.status(200).send({messege: 'funcionario cadastrado'})

        next()

    } catch (erro) {
        res.status(500).send({message: 'erro servidor'})
    }
})

router.get('/api/funcionario', async (req, res, next) => {
    const funcionario = await prisma.funcionario.findMany();
    res.status(200).send(funcionario);
})

router.get('/api/funcionario/:id', async (req, res, next) => {

    try {

        const {id} = req.params
        const funcionario = await prisma.funcionario.findUnique({
            where: {id: String(id)}
        })

        if (funcionario) {
            res.status(200).send(funcionario)
        } else {
            res.status(404).send({message: 'funcionario não encontrado ou inexistente'})
        }

    } catch (erro) {
        res.status(500).send({message: 'erro servidor'})
    }

})

router.put('/api/funcionario/:id', async (req, res) => {
    try {

        const {nome, idade, cargo} = req.body;
        const {id} = req.params;

        const foudFuncionario = await prisma.funcionario.findUnique({
            where: {id: String(id)}
        })
        if (foudFuncionario) {
            const funcionario = await prisma.funcionario.update({
                where: {id: String(id)},
                data: {
                    nome,
                    idade,
                    cargo
                }
            });
            if (funcionario) {
                res.status(200).send({
                    message: 'funcionario atualizado',
                    funcionario
                })
            }
        } else {
            res.status(404).send({message: 'funcionario não encontrado'})
        }

    } catch (erro) {
        res.status(500).send({message: 'erro servidor'})
    }
})

router.delete('/api/funcionario/:id', async (req, res, next) => {
    const {id} = req.params;

    const foundFuncionario = await prisma.funcionario.findUnique({
        where: {id: String(id)}
    })

    if (foundFuncionario) {
        await prisma.funcionario.delete({
            where: {id: String(id)}
        })
        res.send({message: 'funcionario removido'})
        next()
    } else {
        res.send({message: 'o funcionario não existe ou não pode ser removido'})
    }

})

export {router}