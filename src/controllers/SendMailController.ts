import { getCustomRepository } from "typeorm";
import { resolve } from 'path';
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import { Request, Response } from 'express';
import SendMailService from "../services/SendMailService";


class SendMailController {

    async execute(request: Request, response: Response){
        const { email , survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userAlready = await usersRepository.findOne({email});

        if(!userAlready){
            return response.status(400).json({
                error: "User does not exists"
            });

        }
        
        const surveyAlreadyExist = await surveysRepository.findOne({id:survey_id});

        if(!surveyAlreadyExist){
            return response.status(400).json({
                error: "Survey does not exists"
            })
        }

        const variables = {
            name: userAlready.name,
            title: surveyAlreadyExist.title,
            description: surveyAlreadyExist.description,
            user_id: userAlready.id,
            link: process.env.URL_MAIL,
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlready = await surveysUsersRepository.findOne({
            where: [{user_id: userAlready.id}, {value: null}],
            relations: ["user", "survey"],
        });

        if(surveyUserAlready){
            await SendMailService.execute(email, surveyAlreadyExist.title, variables, npsPath);
            return response.json(surveyUserAlready);
        }

        // salvar informações no banco de dados

        const surveyUser = surveysUsersRepository.create({
            user_id: userAlready.id,
            survey_id,
        });

        
        await surveysUsersRepository.save(surveyUser);
        
        // Enviar email para usuário

        await SendMailService.execute(email,surveyAlreadyExist.title, variables, npsPath);

        return response.json(surveyUser);

    }
}

export { SendMailController }