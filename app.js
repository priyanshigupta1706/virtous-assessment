const mysql= require('mysql');
const prompt=require('prompt-sync')();

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'sampledb'
});

db.connect(err => {
    if(err) throw err;
    console.log('Database connected');
    main();
});

function getcandidates() {
    const StudentName=prompt('Enter the name: ');
    if(StudentName.length === 0 || StudentName.length > 30) {
        console.log('Invalid name');
        return null;
    }
    const CollegeName=prompt('Enter college name: ');
    if(CollegeName.length === 0 || CollegeName.length > 50) {
        console.log('Invalid college name');
        return null;
    }
    const Round1marks=parseFloat(prompt('Enter round 1 marks: '));
    const Round2marks=parseFloat(prompt('Enter round 2 marks: '));
    const Round3marks=parseFloat(prompt('Enter round 3 marks: '));
    const TechnicalRoundMarks=parseFloat(prompt('Enter technical marks: '));

    if (
        isNaN(Round1marks) || Round1marks < 0 || Round1marks > 10 || isNaN(Round2marks) || Round2marks < 0 || Round2marks > 10 || isNaN(Round3marks) || Round3marks <0 || Round3marks > 10 || isNaN(TechnicalRoundMarks) || TechnicalRoundMarks <0 || TechnicalRoundMarks > 20 
    ) {
        console.log('Invalid marks ');
        return null;
    }
    const TotalMarks=Round1marks+Round2marks+Round3marks+TechnicalRoundMarks;
    const Result=(TotalMarks >=35) ? 'Selected' : 'Rejected';
    return {StudentName, CollegeName, Round1marks, Round2marks, Round3marks, TechnicalRoundMarks, TotalMarks,Result};
}

function save(candidatedata, callback) {
    const query= `INSERT INTO Candidates (StudentName, Collegename, Round1Marks, Round2Marks, Round3Marks, TechnicalRoundMarks, TotalMarks, Result) VALUES (?,?,?,?,?,?,?,?)`;
    const values= [
        candidatedata.StudentName,
        candidatedata.CollegeName,
        candidatedata.Round1marks,
        candidatedata.Round2marks,
        candidatedata.Round3marks,
        candidatedata.TechnicalRoundMarks,
        candidatedata.TotalMarks,
        candidatedata.Result
    ];
    
    db.query(query,values,(err, result) => {
        if(err) throw err;
        console.log('candidate saved');
        callback();
    });
}

function calcurank(callback) {
   const selectquery='SELECT * FROM Candidates ORDER BY TotalMarks DESC';
   db.query(selectquery, (err, results) => {
    if(err) throw err;

    let rank=1;
    let prev=null;
    let same=0;
    const updaterank =(index) => {
        if(index >= results.length) {
            return callback();
        }
        const candidate=results[index];
        if(candidate.TotalMarks == prev) {
            same++;
        }
         else {
            rank+=same;
            same=1;
            prev=candidate.TotalMarks;
         }
         const updatequery ='UPDATE Candidates SET Rank= ? WHERE id =?';
         db.query(updatequery, [rank,candidate.id], (err) => {
            if(err) throw err;
            updaterank(index+1);
         });
    };
    updaterank(0);
   });
}

function display() {
    const query='SELECT * FROM Candidates ORDER BY Rank ASC';
    db.query(query ,(err, results) => {
        if(err) throw err;
        console.table(results);
        db.end();
        process.exit();
    });
}

function main() {
    let StudentName=' ';
    let CollegeName=' ';
    let Round1marks=0;
    let Round2marks=0;
    let Round3marks=0;
    let TechnicalRoundMarks=0;
    while(true) {
        StudentName=prompt('Enter the name ');
        if(StudentName.length > 0 && StudentName.length <=30) {
            break;
        }
        console.log('Invalid name');
    }
    while(true) {
        CollegeName=prompt('Enter college name: ');
        if(CollegeName.length > 0 && CollegeName.length <=50) {
            break;
        }
        console.log('Invalid college name');
    }
    // while(true) {
    //     Round1marks=parseFloat(prompt('Enter round 1 marks: '));
    //     if(!isNaN(Round1marks) && Round1marks >=0 && Round1marks <=10) {
    //         break;
    //     }
    //     console.log('Invalid marks');
    // }
    // while(true) {
    //     Round2marks=parseFloat(prompt('Enter round 2 marks: '));
    //     if(!isNaN(Round2marks) && Round2marks >=0 && Round2marks <=10) {
    //         break;
    //     }
    //     console.log('Invalid marks');
    // }
    // while(true) {
    //     Round3marks=parseFloat(prompt('Enter round 3 marks: '));
    //     if(!isNaN(Round3marks) && Round3marks >=0 && Round3marks <=10) {
    //         break;
    //     }
    //     console.log('Invalid marks');
    // }
    // while(true) {
    //     TechnicalRoundMarks=parseFloat(prompt('Enter technical marks: '));
    //     if(!isNaN(TechnicalRoundMarks) && TechnicalRoundMarks >=0 && TechnicalRoundMarks <=20) {
    //         break;
    //     }
    //     console.log('Invalid marks');
    // } 

    while(true) {
        Round1marks=parseFloat(prompt('Enter round 1 marks: '));
        Round2marks=parseFloat(prompt('Enter round 2 marks: '));
        Round3marks=parseFloat(prompt('Enter round 3 marks: '));
        TechnicalRoundMarks=parseFloat(prompt('Enter technical marks: '));
        if(
            isNaN(Round1marks) && Round1marks >=0 && Round1marks <=10 &&
            isNaN(Round2marks) && Round2marks >=0 && Round2marks <=10 &&
            isNaN(Round3marks) && Round3marks >=0 && Round3marks <=10 &&
            isNaN(TechnicalRoundMarks) && TechnicalRoundMarks >=0 && TechnicalRoundMarks <=20
        ) {
            console.log('Inavlid marks');
        } else {
            break;
        }
    }
    const TotalMarks=Round1marks+Round2marks+Round3marks+TechnicalRoundMarks;
    const minRoundmarks=7.0;
    const mintechmarks=14.0;
    let Result='Selected';
    if (
        Round1marks < minRoundmarks || Round2marks < minRoundmarks ||
        Round3marks < minRoundmarks || TechnicalRoundMarks < mintechmarks ||
        TotalMarks < 35
    ) {
        Result='Rejected';
    }
    const candidatedata={StudentName, CollegeName, Round1marks, Round2marks, Round3marks, TechnicalRoundMarks, TotalMarks, Result};


    // const StudentName=prompt('Enter the name: ');

    // const TotalMarks=Round1marks+Round2marks+Round3marks+TechnicalRoundMarks;
    // const Result=(TotalMarks >= 35) ? 'Selected' : 'Rejected';
    // const candidatedata={StudentName, CollegeName, Round1marks, Round2marks, Round3marks, TechnicalRoundMarks, TotalMarks, Result};
//     let candidateData=null;
//     do {
//         const StudentName=prompt('Enter the name: ');
//         if(StudentName.length===0 || StudentName.length > 30) {
//             console.log('Inavlid name');
//             continue;
//         }
//         const CollegeName=prompt('Enter college name: ');
//         if(CollegeName.length===0 || CollegeName.length > 50) {
//             console.log('Invalid college name');
//             continue;
//         }
//         const Round1marks=parseFloat(prompt('Enter round 1 marks: '));
//         const Round2marks=parseFloat(prompt('Enter round 2 marks: '));
//         const Round3marks=parseFloat(prompt('Enter round 3 marks: '));
//         const TechnicalRoundMarks=parseFloat(prompt('Enter technical marks: '));
//     if(
//         isNaN(Round1marks) || Round1marks < 0 || Round1marks > 10 || isNaN(Round2marks) || Round2marks < 0 || Round2marks > 10 || isNaN(Round3marks) || Round3marks <0 || Round3marks > 10 || isNaN(TechnicalRoundMarks) || TechnicalRoundMarks <0 || TechnicalRoundMarks > 20
//     ) {
//         console.log('Inavalid marks');
//         continue;
//     }
// const TotalMarks=Round1marks+Round2marks+Round3marks+TechnicalRoundMarks;
// const Result=(TotalMarks>=35) ? 'Selected' : 'Rejected';
// candidateData={StudentName, CollegeName, Round1marks, Round2marks, Round3marks, TechnicalRoundMarks, TotalMarks, Result};
// } while(!candidateData)
    //     candidateData=getcandidates();
    //     if(!candidateData) {
    //         console.log('invalid input, please re-enter');
    //     }
    // }

    // const candidatedata=getcandidates();
    // if(!candidatedata) {
    //     console.log('invalid input');
    //     db.end();
    //     process.exit();
    // }

    save(candidatedata,() => {
        calcurank(() => {
            console.log('update ranks');
            display();
        });
    });
}