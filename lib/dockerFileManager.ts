import Docker from 'dockerode';

interface DockerOptions {
    socketPath?: string;
    host?: string;
    port?: number;
    ca?: string;
    cert?: string;
    key?: string;
}

class DockerFileManager {
    private docker: Docker;
    private container;

    constructor(private options?: DockerOptions) {
        this.docker = new Docker(options);
        this.container = null;
    }

    setContainer(containerId: string) {
        this.container = this.docker.getContainer(containerId);
    }

    unsetContainer() {
        this.container = null;
    }

    private async execCommand(command: string): Promise<string> {
        if (!this.container) {
            throw new Error('Container not set. Call setContainer(containerId) first.');
        }

        const exec = await this.container.exec({
            Cmd: ['sh', '-c', command],
            AttachStdout: true,
            AttachStderr: true
        });

        const stream = await exec.start();
        return new Promise((resolve, reject) => {
            let output = '';
            stream.on('data', (data) => {
                output += data.toString();
            });
            stream.on('end', () => resolve(output));
            stream.on('error', reject);
        });
    }

    private async detectPlatform(): Promise<'linux' | 'macos' | 'windows'> {
        try {
            const platform = await this.execCommand('uname');
            if (platform.trim().toLowerCase() === 'darwin') {
                return 'macos';
            } else if (platform.trim().toLowerCase() === 'linux') {
                return 'linux';
            }
        } catch (err) {
            console.error(`Failed to detect platform: ${err.message}`);
        }
        // Fallback to default behavior (assuming Linux)
        return 'linux';
    }

    async writeFile(filePath: string, content: string = ''): Promise<boolean> {
        try {
            const platform = await this.detectPlatform();
            let command = '';
            switch (platform) {
                case 'macos':
                    command = `echo "${content}" > ${filePath}`;
                    break;
                case 'windows':
                    command = `echo ${content} > ${filePath.replace(/\//g, '\\')}`;
                    break;
                default: // Linux
                    command = `echo "${content}" > ${filePath}`;
                    break;
            }
            await this.execCommand(command);
            return true;
        } catch (err) {
            console.error(`Failed to create file ${filePath}: ${err.message}`);
            return false;
        }
    }

    async renameFile(oldPath: string, newPath: string): Promise<boolean> {
        try {
            const platform = await this.detectPlatform();
            let command = '';
            switch (platform) {
                case 'macos':
                case 'linux':
                    command = `mv ${oldPath} ${newPath}`;
                    break;
                case 'windows':
                    command = `move ${oldPath.replace(/\//g, '\\')} ${newPath.replace(/\//g, '\\')}`;
                    break;
                default: // Default fallback to Linux behavior
                    command = `mv ${oldPath} ${newPath}`;
                    break;
            }
            await this.execCommand(command);
            return true;
        } catch (err) {
            console.error(`Failed to rename file ${oldPath} to ${newPath}: ${err.message}`);
            return false;
        }
    }

    async deleteFile(filePath: string): Promise<boolean> {
        try {
            const platform = await this.detectPlatform();
            let command = '';
            switch (platform) {
                case 'macos':
                case 'linux':
                    command = `rm ${filePath}`;
                    break;
                case 'windows':
                    command = `del ${filePath.replace(/\//g, '\\')}`;
                    break;
                default: // Default fallback to Linux behavior
                    command = `rm ${filePath}`;
                    break;
            }
            await this.execCommand(command);
            return true;
        } catch (err) {
            console.error(`Failed to delete file ${filePath}: ${err.message}`);
            return false;
        }
    }

    async createFolder(folderPath: string): Promise<boolean> {
        try {
            const platform = await this.detectPlatform();
            let command = '';
            switch (platform) {
                case 'macos':
                case 'linux':
                    command = `mkdir -p ${folderPath}`;
                    break;
                case 'windows':
                    command = `mkdir ${folderPath.replace(/\//g, '\\')}`;
                    break;
                default: // Default fallback to Linux behavior
                    command = `mkdir -p ${folderPath}`;
                    break;
            }
            await this.execCommand(command);
            return true;
        } catch (err) {
            console.error(`Failed to create folder ${folderPath}: ${err.message}`);
            return false;
        }
    }

    async renameFolder(oldPath: string, newPath: string): Promise<boolean> {
        try {
            const platform = await this.detectPlatform();
            let command = '';
            switch (platform) {
                case 'macos':
                case 'linux':
                    command = `mv ${oldPath} ${newPath}`;
                    break;
                case 'windows':
                    command = `move ${oldPath.replace(/\//g, '\\')} ${newPath.replace(/\//g, '\\')}`;
                    break;
                default: // Default fallback to Linux behavior
                    command = `mv ${oldPath} ${newPath}`;
                    break;
            }
            await this.execCommand(command);
            return true;
        } catch (err) {
            console.error(`Failed to rename folder ${oldPath} to ${newPath}: ${err.message}`);
            return false;
        }
    }

    async deleteFolder(folderPath: string): Promise<boolean> {
        try {
            const platform = await this.detectPlatform();
            let command = '';
            switch (platform) {
                case 'macos':
                case 'linux':
                    command = `rm -r ${folderPath}`;
                    break;
                case 'windows':
                    command = `rmdir /s /q ${folderPath.replace(/\//g, '\\')}`;
                    break;
                default: // Default fallback to Linux behavior
                    command = `rm -r ${folderPath}`;
                    break;
            }
            await this.execCommand(command);
            return true;
        } catch (err) {
            console.error(`Failed to delete folder ${folderPath}: ${err.message}`);
            return false;
        }
    }

    async getFileStats(filePath: string): Promise<any> {
        try {
            const platform = await this.detectPlatform();
            let statsCommand = '';
            switch (platform) {
                case 'macos':
                    statsCommand = `stat -f '{"mode": "%Sp", "size": "%z", "owner": "%Su", "group": "%Sg", "modified": "%Sm", "accessed": "%Sa"}' ${filePath}`;
                    break;
                case 'windows':
                    statsCommand = `powershell -Command "& {Get-Item -Path '${filePath.replace(/\//g, '\\')}'} | ConvertTo-Json"`;
                    break;
                default: // Linux
                    statsCommand = `stat -c '{"mode": "%a", "size": "%s", "owner": "%U", "group": "%G", "modified": "%y", "accessed": "%x"}' ${filePath}`;
                    break;
            }
            if (statsCommand) {
                const stats = await this.execCommand(statsCommand);
                return JSON.parse(stats);
            } else {
                console.error(`Unsupported platform for getting file stats: ${platform}`);
                return null;
            }
        } catch (err) {
            console.error(`Failed to get file stats for ${filePath}: ${err.message}`);
            return null;
        }
    }
}

export default DockerFileManager;
