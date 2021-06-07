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
        desayuno: [String] 
        mediaManana: [String]
        almuerzo: [String]     
        algo: [String]
        cena: [String]   
        refrigerio: [String]
    }

    type Minuta {
        _id: ID!
        fechaInicial: String!
        fechaFinal: String!
        menus: PlanMenu!
        diasMenus: Int
        diasMinuta: [String!]
        intolerancias: [String!]!
        usuarioId: Usuario!
    }

    type Intolerancias {
        intolerancias: [String!]!
        alimentos: [String!]!
    }

    type PlanMenu {
        desayuno: [Menu!]
        mediaManana: [Menu!]
        almuerzo: [Menu!]     
        algo: [Menu!]
        cena: [Menu!]   
        refrigerio: [Menu!]
    }

    type Menu{
        dia: String
        nombreMenu:[String!]
        receta: Receta
        ingrediente: [String!]
        preparacion: String!
    }

    type Receta{
        nombre: String
        salsa: Salsa!
        proteina: String
        corteProteina: String
        coccionPorteina: String
        prepraracion: String
    }

    type Salsa{
        nombre: String
        ingredientes: [String]
        preparacion: String
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