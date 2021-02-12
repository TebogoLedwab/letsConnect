
export class User {
    _id?: string;
    name?: string;
    email?: string;
    password?: string;
    avatar?: string;
    backgroundImage?: string;
    // tslint:disable-next-line:variable-name
    mobile_number?: string;
    gender?: string;
    age?: string;
    date?: any;
    confirmed?: boolean;
}


export class Experience {
    title?: string;
    company?: string;
    location?: string;
    from?: any;
    to?: any;
    current?: boolean;
    description?: string;
    date?: any;
}


export class Profile {
    // tslint:disable-next-line:variable-name
    _id?: string;
    user: any;
    status: string;
    skills: Array<string>;
    interests: Array<string>;
    bio?: string;
    cv?: string;
    points?: number;
    experience?: Experience[];
}

export class Blog {
    // tslint:disable-next-line:variable-name
    _id?: string;
    user?: any;
    title: string;
    content: string;
    image?: string;
    likes?: string[];
    dislikes?: string[];
    datePosted?: Date;
}

export class Community {
    // tslint:disable-next-line:variable-name
    _id?: string;
    user?: any;
    title: string;
    content: string;
    tags: string[];
    image?: string;
    likes?: string[];
    dislikes?: string[];
    comments?: Comment[];
    datePosted?: Date;
}

export class Comment {
    user?: any;
    comment: string;
    date?: Date;
}

export class Application {
    _id?: string;
    user: any;
    date?: Date;
    status?: string;
}

export class Cohort {
    _id?: string;
    name: string;
    internNumber: number;
    endDate: Date;
    startDate: Date;
    notes: string;
}

/* 

const {
    name,
    internNumber,
    startDate,
    endDate,
    notes
} = req.body;

try {

    // create instance of the user
    cohort = new Cohort({
        name,
        internNumber,
        startDate,
        endDate,
        notes
    });

    //save  the information to profile after registerting
    await cohort.save(async function (err, user) {

            res.json({
                msg: "Please confirm you email address"
            });

    }

*/