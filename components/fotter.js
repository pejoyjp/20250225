import React from "react";
import { FaTiktok, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa6";
import BoldLink from "./boldLink";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-whhite py-10 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        <div>
          <div className="flex items-center space-x-2">

            <div>
                <Image src="/logo.png" height={40} width={40} alt="" 
                        
                />
                
                <p className="text-gray-700 text-sm">
                Chat with any PDF: ask questions, get summaries, find information, and more.
                </p>

            </div>
            
          </div>
          <div className="flex mt-4 space-x-4 text-gray-600">
            <FaTiktok size={20} />
            <FaInstagram size={20} />
            <FaTwitter size={20} />
            <FaYoutube size={20} />
          </div>
        </div>


        <div>
            <BoldLink>
                Products
            </BoldLink>
       
          <ul className="text-gray-600 text-sm space-y-1">
            <li>Use cases</li>
            <li>Chrome extension</li>
            <li>API docs</li>
            <li>Pricing</li>
            <li>Video tutorials</li>
            <li>Resources</li>
            <li>Blog</li>
            <li>FAQ</li>
          </ul>
        </div>

     
        <div>
          <BoldLink>
          We also built
        </BoldLink>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>Resume AI Scanner</li>
            <li>Invoice AI Scanner</li>
            <li>AI Quiz Generator</li>
            <li>QuickyAI</li>
            <li>Docsium</li>
            <li>PDF GPTs</li>
            <li>Other PDF tools</li>
          </ul>
        </div>

   
        <div>
        <BoldLink>
            Company
        </BoldLink>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>PDF.ai vs ChatPDF</li>
            <li>PDF.ai vs Acrobat Reader</li>
            <li>Legal</li>
            <li>Affiliate program 📈</li>
            <li>Investor</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
