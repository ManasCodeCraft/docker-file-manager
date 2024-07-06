# DockerFileManager

DockerFileManager is a TypeScript library for managing files and folders within Docker containers using Dockerode.

## Installation

You can install DockerFileManager via npm:

```bash
npm install docker-file-manager
```

## Usage

### Initializing DockerFileManager

Create an instance of `DockerFileManager` by passing Docker connection options:

```typescript
const options: DockerOptions = {
    socketPath: '/var/run/docker.sock', // Example: Docker socket path
};

const manager = new DockerFileManager(options);
```

### Setting and Unsetting Docker Container

Before performing file operations, set the Docker container using `setContainer(containerId: string)`:

```typescript
manager.setContainer('container_id_here');
```

To unset the container and perform operations outside any specific container context:

```typescript
manager.unsetContainer();
```

### File Operations

#### Creating a File

Create a new file inside the Docker container:

```typescript
await manager.createFile('/path/to/file.txt', 'File contents...');
```

#### Renaming a File

Rename a file within the Docker container:

```typescript
await manager.renameFile('/path/to/old.txt', '/path/to/new.txt');
```

#### Deleting a File

Delete a file from the Docker container:

```typescript
await manager.deleteFile('/path/to/file.txt');
```

#### Creating a Folder

Create a new folder inside the Docker container:

```typescript
await manager.createFolder('/path/to/new_folder');
```

#### Renaming a Folder

Rename a folder within the Docker container:

```typescript
await manager.renameFolder('/path/to/old_folder', '/path/to/new_folder');
```

#### Deleting a Folder

Delete a folder and its contents from the Docker container:

```typescript
await manager.deleteFolder('/path/to/folder');
```

#### Getting File Stats

Retrieve file statistics (e.g., mode, size, owner) from the Docker container:

```typescript
const stats = await manager.getFileStats('/path/to/file.txt');
console.log('File Stats:', stats);
```

### Error Handling

All methods handle errors gracefully. If an operation fails, an error message will be logged to the console, and the method will return `false` or `null`.

### Platform Detection

The library automatically detects the platform (Linux, macOS, Windows) of the Docker container and adjusts commands accordingly.

### License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
