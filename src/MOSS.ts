import { glob } from 'glob';
import * as fs from 'fs/promises';
import * as net from 'net';


export class MOSS {
    // setup the userID
    private userID: string;

    // setup the connections
    private mossServer: string;
    private mossPort: number;

    // setup the base files
    private baseFiles: string[] = [];

    // setup the submission files
    private submissionFiles: string[] = [];

    // setup all the supported programming languages
    private supportedLanguages: string[] = [
        "c",           // C Language
        "cc",          // C++ Language
        "java",        // Java Language
        "ml",          // ML Language
        "pascal",      // Pascal Language
        "ada",         // Ada Language
        "lisp",        // Lisp Language
        "scheme",      // Scheme Language
        "haskell",     // Haskell Language
        "fortran",     // Fortran Language
        "ascii",       // ASCII Language
        "vhdl",        // VHDL Language
        "perl",        // Perl Language
        "matlab",      // MATLAB Language
        "python",      // Python Language
        "mips",        // MIPS Language
        "prolog",      // Prolog Language
        "spice",       // SPICE Language
        "vb",          // VB Language
        "csharp",      // C# Language
        "modula2",     // Modula2 Language
        "a8086",       // A8086 Language
        "javascript",  // JavaScript Language
        "plsql",       // PL/SQL Language
        "verilog"      // Verilog Language
    ];

    // setup the options
    private options = {
        "c": "",       // comment
        "d": 0,        // directory mode
        "l": "c",      // language
        "m": 10,       // maximum matches 
        "n": 250,      // number of results
        "x": 0,        // experimental server  
    };

    // constructor to define the userID and the connections
    constructor(userID: string, mossServer: string = "moss.stanford.edu", mossPort: number = 7690) {
        this.userID = userID;

        this.mossServer = mossServer;
        this.mossPort = mossPort;

        this.options["c"] = "";
        this.options["d"] = 0;
        this.options["l"] = "c";
        this.options["m"] = 10;
        this.options["n"] = 250;
        this.options["x"] = 0;
    }

    // getters
    // function to get the userID
    public getUserID(): string {
        return this.userID;
    }

    // function to get the comment
    public getComment(): string {
        return this.options["c"];
    }

    // function to get the directory mode
    public getDirectoryMode(): number {
        return this.options["d"];
    }

    // function to get the language
    public getSupportedLanguages(): string[] {
        return this.supportedLanguages;
    }

    // function to get the maximum matches
    public getIgnoreLimit(): number {
        return this.options["m"];
    }

    // function to get the number of results
    public getResultLimit(): number {
        return this.options["n"];
    }

    // function to get the experimental server
    public getExperimentalServer(): number {
        return this.options["x"];
    }

    // setters
    // function to set the userID
    public setUserID(userID: string) {
        this.userID = userID;
    }

    // function to set the comment
    public setComment(comment: string) {
        this.options["c"] = comment;
    }

    // function to set the directory mode
    public setDirectoryMode(directoryMode: number) {
        if (directoryMode == 0 || directoryMode == 1) {
            this.options["d"] = directoryMode;
            return true;
        } else {
            throw new Error("Directory mode is not supported!, must be 0 or 1");
        }
    }

    // function to set the language
    public setLanguage(language: string) {
        if (this.supportedLanguages.includes(language)) {
            this.options["l"] = language;
            return true;
        } else {
            throw new Error("Language is not supported");
        }
    }

    // function to set the maximum matches
    public setIgnoreLimit(ignoreLimit: number) {
        if (ignoreLimit > 1) {
            this.options["m"] = ignoreLimit;
            return true;
        } else {
            throw new Error("Ignore limit must be greater than 1");
        }
    }

    // function to set the number of results
    public setResultLimit(resultLimit: number) {
        if (resultLimit > 1) {
            this.options["n"] = resultLimit;
            return true;
        } else {
            throw new Error("Number of results must be greater than 1");
        }
    }

    // function to set the experimental server
    public setExperimentalServer(experimentalServer: number) {
        if (experimentalServer == 0 || experimentalServer == 1) {
            this.options["x"] = experimentalServer;
            return true;
        } else {
            throw new Error("Experimental server is not supported!, must be 0 or 1");
        }
    }

    // function to add a base file
    public async addBaseFile(file: string): Promise<void> {
        try {
            await fs.stat(file);
            this.baseFiles.push(file);
        } catch (error) {
            throw new Error(`Cannot find or read the base file: ${file}`);
        }
    }

    // function to add a file
    public async addFile(filePath: string): Promise<void> {
        try {
            await fs.stat(filePath);
            this.submissionFiles.push(filePath);
        } catch (error) {
            throw new Error(`Cannot find or read the file: ${filePath}`);
        }
    }

    // function to add files by a wildcard
    public async addByWildcard(path: string): Promise<void> {
        const files = await glob(path, { nodir: true });
        for (const file of files) {
            await this.addFile(file);
        }
    }

    // Helper function to send a command and await the single-line response from MOSS
    private sendCommand(client: net.Socket, command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let buffer = '';

            const onData = (data: Buffer) => {
                try {
                    // append the data to the buffer until MOSS sends '\n'
                    buffer += data.toString();
                    if (buffer.includes('\n')) {
                        const [line] = buffer.split('\n', 1);
                        client.removeListener('data', onData);
                        client.removeListener('error', onError);
                        resolve(line.trim());
                    }
                } catch (err) {
                    // remove the listeners and reject the promise
                    client.removeListener('data', onData);
                    client.removeListener('error', onError);
                    reject(new Error(`Processing Error: ${err}`));
                }
            };

            // handle the error
            const onError = (err: Error) => {
                client.removeListener('data', onData);
                client.removeListener('error', onError);
                reject(new Error(`MOSS Socket Error: ${err.message}`));
            };

            // add the listeners
            client.once('data', onData);
            client.once('error', onError);

            // send the command
            client.write(command + '\n');
        });
    }

    // function to upload a file
    private async uploadFile(client: net.Socket, filePath: string, id: number): Promise<void> {
        try {
            const stats = await fs.stat(filePath);
            const size = stats.size;
            const fileBuffer = await fs.readFile(filePath);
            const fileNameFixed = filePath.replace(/ /g, '_');

            // protocol command style: "file <fileId> <language> <size> <filename>
            const protocolCommand = `file ${id} ${this.options.l} ${size} ${fileNameFixed}`;

            // send the protocol command
            client.write(protocolCommand + '\n');
            await new Promise<void>((resolve, reject) => {
                client.write(fileBuffer, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        } catch (error) {
            throw new Error(`Failed to upload file ${filePath}: ${error}`);
        }
    }

    private client: net.Socket | null = null;
    public async send() {
        this.client = net.connect(this.mossPort, this.mossServer);
        const socket = this.client;

        await new Promise<void>((resolve, reject) => {
            socket.once('connect', resolve);
            socket.once('error', reject);
        });

        // send the commands
        try {
            // loging the user in with the userId
            socket.write(`moss ${this.userID}\n`);

            // directory mode
            socket.write(`directory ${this.options["d"]}\n`);
            // experimental server
            socket.write(`X ${this.options["x"]}\n`);
            // maximum matches
            socket.write(`maxmatches ${this.options["m"]}\n`);
            // number of results                          
            socket.write(`show ${this.options["n"]}\n`);

            // language
            const langResponse = await this.sendCommand(socket, `language ${this.options["l"]}`);
            if (langResponse.toLowerCase() === 'no') {
                throw new Error(`Unsupported language: ${this.options.l}`);
            }

            // send the basefile
            for (const bfile of this.baseFiles) {
                await this.uploadFile(socket, bfile, 0);
            }

            // send the submission files each with an incrementing id
            let submissionId = 1;
            for (const file of this.submissionFiles) {
                await this.uploadFile(socket, file, submissionId++);
            }

            // send the query
            const queryCommand = `query 0 ${this.options.c || ''}`;
            const mossUrl = await this.sendCommand(socket, queryCommand);

            return mossUrl;
        } catch (error) {
            throw new Error(`Socket Error: ${error}`);
        } finally {
            socket.write('end\n');
            socket.end();
            this.client = null;
        }
    }
}