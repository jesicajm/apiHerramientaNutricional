const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Usuario {
        _id: ID!
        nombre: String! 
        email: String!
        password: String!
    }

    type Plan {
        desayuno: [String!]! 
        mediaManana: [String!]!
        almuerzo: [String!]!     
        algo: [String!]!
        cena: [String!]!   
        refrigerio: [String!]!
    }

    type Minuta {
        _id: ID!
        fechaInicial: String!
        fechaFinal: String!
        intolerancias: [String!]!
        usuarioId: Usuario!
    }

    type AuthData {
        token: String!
        usuarioId: String!
    }

    input UserInputData{
        nombre: String!
        email: String!
        password: String!
        confirmPassword: String!
    }
    
    input UserInputPlan{
        desayuno: String!
        mediaManana: String!
        almuerzo: String!  
        algo: String!
        cena: String!  
        refrigerio: String!
    }

    input InputMinuta{
        fechaInicial: String!
        fechaFinal: String!
        intolerancias: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData! 
        planUsuario: Plan!
    }

    type RootMutation {
        crearUsuario(userInput: UserInputData): Usuario!
        guardarPlanNutricional(userInput: UserInputPlan): Plan!
        guardarPlanMinuta(inputMinuta: InputMinuta): Minuta! 
    }

    schema {
       query: RootQuery
       mutation: RootMutation
    }
`);