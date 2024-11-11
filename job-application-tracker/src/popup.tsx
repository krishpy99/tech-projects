import React, { useState, useEffect } from 'react';
import './style.css';
import { Button } from './components/Button';
import { AppliedJobsList } from './components/AppliedJobsList';
import axios from 'axios';

function getCurrentTab() {
  return chrome.tabs.query({ active: true, currentWindow: true })
    .then(tabs => tabs[0]);
}

async function processPageContent(html: string) {
  const response = await axios.post(`${process.env.BACKEND_URL}/process-job`, { html });
  return response.data;
}

async function saveJobToDB(jobData: any) {
  await axios.post(`${process.env.BACKEND_URL}/save-job`, jobData);
}

function getPageHTML(callback: (html: string) => void) {
  getCurrentTab().then(tab => {
    if (tab.id === undefined) return;

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.documentElement.outerHTML,
    }).then(injectionResults => {
      for (const frameResult of injectionResults) {
        const html = frameResult.result as string;
        if (callback) callback(html);
      }
    });
  });
}

const IndexPopup = () => {
  const [url, setUrl] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getCurrentTab().then(tab => {
      setUrl(tab.url || "");
    });
  }, []);

  const handleSaveJob = async () => {
    setIsProcessing(true);
    try {
      getPageHTML(async (html) => {
        const jobData = await processPageContent(html);
        jobData.url = url;
        jobData.appliedDate = new Date().toISOString();
        await saveJobToDB(jobData);
        setRefreshTrigger(prev => prev + 1);
      });
    } catch (error) {
      console.error("Error processing job:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Current URL: {url}</h2>
      <Button onClick={handleSaveJob} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Save Job Application'}
      </Button>
      <AppliedJobsList refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default IndexPopup;