const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Usuario {
        _id: ID!
        nombre: String! 
        email: String!
        password: String!
    }

    type Plan {
        tienePlan: Boolean,
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
        menus:[Menu!]!
        intolerancias: [String!]!
        usuarioId: Usuario!
    }

    type Intolerancias {
        intolerancias: [String!]!
        alimentos: [String!]!
    }

    type Menu {
        _id: ID!
        dia: String!
        desayuno: TipoAlimento
        mediaManana: TipoAlimento
        almuerzo: TipoAlimento     
        algo: TipoAlimento
        cena: TipoAlimento   
        refrigerio: TipoAlimento
    }

    type TipoAlimento {
        leche: [String!]
        proteina: [String!]
        harinas: [String!]
        verduras: [String!]
        frutas: [String!]
        leguminosas: [String!]
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
        minuta: Minuta!
        intolerancias: Intolerancias! 
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