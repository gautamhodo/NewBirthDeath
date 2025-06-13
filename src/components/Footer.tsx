import React, { useState } from 'react';
import './Footer.css';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const shortcutSections = [
  {
    title: 'GENERAL SHORTCUTS',
    shortcuts: [
      { keys: 'ALT+CTRL+L', desc: 'Log out or login' },
      { keys: 'ALT+S', desc: 'Search Patient (Clear and search if patient selected)' },
      { keys: 'ALT+R', desc: 'Register patient' },
      { keys: 'ALT+H', desc: 'Visit History (After patient selected)' },
      { keys: 'ALT+A', desc: 'Assign Doctor/Lab Tests (After patient selected)' },
      { keys: 'ALT+F', desc: 'Add Pending Lab Result' },
      { keys: 'ALT+J', desc: 'Add Pending Radiology Result (After patient selected)' },
      { keys: 'ALT+U', desc: 'Add Pending Procedure Result (After patient selected)' },
      { keys: 'ALT+Z', desc: 'View Lab Entered Results' },
      { keys: 'ALT+Y', desc: 'Home collection registration' },
      { keys: 'F1', desc: 'Search' },
      { keys: 'F2', desc: 'Todays Bills' },
      { keys: 'F3', desc: 'Todays Visits' },
      { keys: 'CTRL + F2', desc: 'Collect Sample' },
      { keys: 'F4', desc: 'Appointments' },
      { keys: 'F6', desc: 'Drug Stocks' },
      { keys: 'ALT + F6', desc: 'Brand Name wise Stock' },
      { keys: 'CTRL + F6', desc: 'Stock transfer' },
      { keys: 'F7', desc: 'Pharmacy Sale' },
      { keys: 'CTRL+F7', desc: 'Pharmacy Sale Return' },
      { keys: 'F8', desc: 'Register Patient' },
      { keys: 'F9', desc: 'New Visit?' },
      { keys: 'ALT+M', desc: 'Search Menu' },
      { keys: 'ALT+B', desc: 'Bills' },
      { keys: 'ALT+K', desc: 'Bookings' },
      { keys: 'ALT+N', desc: 'Next Patient' },
      { keys: 'ALT+Q', desc: 'Lab pending' },
      { keys: 'ALT+W', desc: 'Radiology pending' },
      { keys: 'ALT+E', desc: 'Procedure pending' },
      { keys: 'ALT+D', desc: 'Drug pharmacy pending' },
      { keys: 'CTRL+ALT+P', desc: 'Printer Settings' },
      { keys: 'CTRL+ALT+C', desc: 'Calculator ( Contact HODO if not working )' },
    ],
  },
  {
    title: 'ADD CONSULTATION PAGE SHORTCUTS',
    shortcuts: [
      { keys: 'ALT+C', desc: 'Chief Complaint' },
      { keys: 'ALT+I', desc: 'Clinical Notes' },
      { keys: 'ALT+O', desc: 'On Examination' },
      { keys: 'ALT+M', desc: 'Symptoms' },
      { keys: 'ALT+G', desc: 'Diagnosis' },
      { keys: 'ALT+V', desc: 'Vitals' },
      { keys: 'ALT+T', desc: 'Treatment Plan' },
      { keys: 'ALT+L', desc: 'Lab Test' },
      { keys: 'ALT+Y', desc: 'Radiology' },
      { keys: 'ALT+P', desc: 'Procedure' },
      { keys: 'ALT+X', desc: 'Common Remarks' },
    ],
  },
];

const Footer: React.FC = () => {
  const toggleFullscreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err: Error) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err: Error) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  return (
    <div className="footer-container">
      <div className="footer-left">
        <span>© 2025 </span>
        <a href="#">www.hodo.com</a>
        <span>Empowering Entrepreneurs in Healthcare </span>
        <Dialog>
          <DialogTrigger asChild>
            <a href="#" style={{ cursor: 'pointer', fontWeight: 500 }}>Short Cuts</a>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Keyboard Shortcuts</DialogTitle>
              <DialogDescription>
                Use these shortcuts to quickly navigate and perform actions in the portal.
              </DialogDescription>
            </DialogHeader>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {shortcutSections.map(section => (
                <Card key={section.title} className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <table style={{ width: '100%' }}>
                      <tbody>
                        {section.shortcuts.map((sc, idx) => (
                          <tr key={sc.keys + idx}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 600, padding: '4px 8px', whiteSpace: 'nowrap' }}>{sc.keys}</td>
                            <td style={{ padding: '4px 8px' }}>{sc.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ))}
            </div>
            <DialogClose asChild>
              <Button variant="secondary" className="mt-2 w-full">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
      <div className="footer-right">
        <button onClick={toggleFullscreen} className="fullscreen-btn">
          ⛶
        </button>
      </div>
    </div>
  );
};

export default Footer;
