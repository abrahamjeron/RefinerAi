import React, { useState } from 'react';
import axios from 'axios';
import { getCorrectedCode } from '../utils/codeCorrector'; // Importing the function

const token = import.meta.env.VITE_GITHUB_TOKEN
const fetchContents = async (url, setError) => {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `token ${token}`,
            },
        });
        const contents = response.data;
        const allFiles = [];

        for (const item of contents) {
            if (item.type === 'file') {
                allFiles.push(item);
            } else if (item.type === 'dir') {
                const subDirContents = await fetchContents(item.url, setError);
                allFiles.push({
                    ...item,
                    contents: subDirContents,
                });
            }
        }

        return allFiles;
    } catch (error) {
        setError('Error fetching repository contents');
        console.error('Error fetching contents:', error);
        return [];
    }
};

const RepoViewer = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [correctedContent, setCorrectedContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [openFolders, setOpenFolders] = useState({});

    const handleFetchRepo = async () => {
        setError(null);
        const [owner, repo] = extractOwnerAndRepo(repoUrl);

        if (!owner || !repo) {
            setError('Invalid repository URL');
            return;
        }

        const url = `https://api.github.com/repos/${owner}/${repo}/contents`;

        // Fetch all contents recursively
        const allFiles = await fetchContents(url, setError);
        setFiles(allFiles);
    };

    const extractOwnerAndRepo = (url) => {
        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        return match ? [match[1], match[2]] : [null, null];
    };

    const toggleFolder = (path) => {
        setOpenFolders((prev) => ({
            ...prev,
            [path]: !prev[path],
        }));
    };

    const fetchFileContent = async (path) => {
        setLoading(true);
        const [owner, repo] = extractOwnerAndRepo(repoUrl);

        try {
            const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
            const decodedContent = atob(response.data.content);
            setFileContent(decodedContent);
            setSelectedFile(path);
            setCorrectedContent(''); // Reset corrected content
        } catch (err) {
            console.error('Error fetching file content:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCorrectCode = async () => {
        try {
            const corrected = await getCorrectedCode(fileContent);
            console.log('Corrected Code:', corrected); 
    
            // Check if the corrected result is an object and has a 'code' property
            if (typeof corrected === 'object' && corrected.code) {
                setCorrectedContent(corrected.code);
            } else {
                setCorrectedContent('Error: No corrected code found.');
            }
        } catch (error) {
            console.error('Error correcting code:', error);
            setCorrectedContent('Error: Unable to correct the code.');
        }
    };
    
    

    const renderFileTree = (items, parentPath = '') => {
        return items.map((item) => {
            const itemPath = `${parentPath}${item.name}`;

            if (item.type === 'dir') {
                return (
                    <div key={item.path} style={{ marginLeft: '20px' }}>
                        <div onClick={() => toggleFolder(itemPath)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                            {openFolders[itemPath] ? '📂 ' : '📁 '} {item.name}
                        </div>
                        {openFolders[itemPath] && item.contents && (
                            <div>{renderFileTree(item.contents, `${itemPath}/`)}</div>
                        )}
                    </div>
                );
            } else {
                return (
                    <div
                        key={item.path}
                        style={{ marginLeft: '20px', cursor: 'pointer' }}
                        onClick={() => fetchFileContent(item.path)}
                    >
                        📄 {item.name}
                    </div>
                );
            }
        });
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Left Panel - File Explorer */}
            <div style={{ width: '30%', background: '#2e2e2e', color: 'white', overflowY: 'auto', padding: '20px' }}>
                <h2 style={{ color: '#61dafb' }}>File Explorer</h2>
                <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="Enter GitHub repo URL"
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <button onClick={handleFetchRepo} style={{ padding: '8px', cursor: 'pointer' }}>
                    Fetch Repo
                </button>

                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

                <div style={{ marginTop: '20px' }}>{renderFileTree(files)}</div>
            </div>

            {/* Right Panel - Code Viewer */}
            <div style={{ width: '70%', padding: '20px', overflowY: 'auto' }}>
                <h2 style={{ color: '#61dafb' }}>
                    {selectedFile ? selectedFile : 'Select a file to view'}
                </h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {/* Left Side - File Content */}
                        <div style={{ width: '50%', background: '#282c34', color: '#61dafb', padding: '20px', borderRadius: '8px' }}>
                            <h3>Original Code</h3>
                            <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                                {fileContent}
                            </pre>
                        </div>

                                                {/* Right Side - Corrected Code */}
                        {/* Right Side - Corrected Code */}
                        <div style={{ 
                            width: '50%', 
                            background: '#1e1e1e', 
                            color: '#b5cea8', 
                            padding: '20px', 
                            borderRadius: '8px',
                            overflowX: 'auto'
                        }}>
                            <h3>Corrected Code</h3>
                            <pre style={{ 
                                whiteSpace: 'pre-wrap', 
                                overflowX: 'auto',
                                color: '#dcdcdc', 
                                backgroundColor: '#2d2d2d',
                                padding: '10px',
                                borderRadius: '4px',
                                fontFamily: 'monospace'
                            }}>
                                {correctedContent || 'Click "Correct Code" to see the result'}
                            </pre>
                        </div>

                    </div>
                )}

                <button onClick={handleCorrectCode} style={{ padding: '8px', cursor: 'pointer', marginTop: '10px' }}>
                    Correct Code
                </button>
            </div>
        </div>
    );
};

export default RepoViewer;