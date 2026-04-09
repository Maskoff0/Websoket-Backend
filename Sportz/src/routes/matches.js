import {Router} from 'express';
import { createMatchSchema } from '../validation/matches.js';
import { db } from '../db/db.js';
import { matches } from '../db/schema.js';
import { getMatchStatus } from '../utils/match-status.js';

export const matchRouter = Router();

const MAX_LIMIT = 100;

matchRouter.get('/' , async (req , res)=>{
   const parsed = matchListQuerySchema.safeParse(req.query);

  if(!parsed.success){
        res.status(400).json({error : "Invalid payload" , details : parsed.error.issues})
    }

  const limit = Math.min(parsed.data.limit ?? 50 , MAX_LIMIT)

    try{
        const data = await db
        .select()
        .from(matches)
        .orderBy((desc(matches.createdAt)))
        .limit(limit)

        res.json({data})

    }catch(err){
        res.status(500).json({error : "Failed to fetch matches"})
    }
})

matchRouter.post('/' , async (req, res)=>{
    const parsed = createMatchSchema.safeParse(req.body);
    
    if(!parsed.success){
        res.status(400).json({error : "Invalid payload" , details : parsed.error.issues})
    }
    const {data : {startTime , endTime , homeScore , awayScore}} = parsed;
    
    try{
        const [event] = await db.insert(matches).values({
            ...parsed.data , 
            startTime : new Data(startTime),
            endTime : new Date(endTime),
            homeScore : homeScore ?? 0,
            awayScore : awayScore ?? 0,
            status : getMatchStatus(startTime , endTime)
        })

        if(res.locals.broadcast){
            res.locals.broadcast(event);
        }
    }catch(err){
        res.status(500).json({error : "Failed to create match"})
    }
})

