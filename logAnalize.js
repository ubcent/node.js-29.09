const fs = require('fs');
let fileLog = process.argv.slice(2)[0];

class Static{
    constructor(fileName){
        if(!fs.existsSync(fileName)){
            console.log("No file");
        } else{
            this.fileName = fileName;
        }
        this.played = 0;
        this.winned = 0;
        this.losed = 0;
        this.winnedInLine = 0;
        this.losedInLine = 0
    }
    analize(){
        if(this.fileName === undefined){
            console.log("Done without analize")
        } else {
            console.log("something");
            let data = [];
            fs.readFile(this.fileName, (err, dataText)=>{
                data = dataText.toString().split("\n");
                let maxWin = 0;
                let maxLose = 0;
                for(let i = 1; i < data.length; i++){
                    if(data[i] == "Start game"){
                        this.played++;
                    }
                    if(data[i] == "WIN"){
                        this.winned++;
                        if(maxWin === 0){
                            maxWin = 1;
                        }
                        if(data[i+1] == "WIN"){
                            maxWin++;
                        } else{
                            if(this.winnedInLine < maxWin){
                                this.winnedInLine = maxWin
                            }
                            maxWin = 0;
                        }
                    } else if(data[i] == "LOSE"){
                        this.losed++;
                        if(maxLose === 0){
                            maxLose = 1;
                        }
                        if(data[i+1] == "LOSE"){
                            maxLose++;
                        } else{
                            if(this.losedInLine < maxLose){
                                this.losedInLine = maxLose
                            }
                            maxLose = 0;
                        }
                    }
                }
                console.log(`${this.played} ${this.winned} ${this.losed} ${this.winnedInLine} ${this.losedInLine}`);
            });
        }
    }
}

let stat = new Static(fileLog);
stat.analize();