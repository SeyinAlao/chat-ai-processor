import styles from './Header.module.css';
import { MessageCircle, Sparkles, Globe, FileText, Languages } from 'lucide-react';
import './EmptyState.css';
import './Boxes.css';

export default function Header () {
    return(
        <>
        <header className={styles.header}>
            <div className={styles.Titlewrapper}>
            <div className={styles.iconWrapper}>
                <Sparkles className={styles.sparkleIcon} />
            </div>
            <h1 className={styles.title}>AI Text Processor</h1>

            </div>
  <p className={styles.subtitle}>
  Send a message to detect language, summarize, and translate text using Azure AI API'S & OpenAI API
</p>
        </header>

        <div className="chat-area" >
            <div className="chat-inner">
              {/*chat content*/}

              <div className="Empty-state">
                <div className="icon-wrapper">
                    <MessageCircle className="chat-icon"/>
                </div>
                <h2 className="S-text">Welcome to AI Text Processor</h2>
                <p className="P-text">Start by typing a message below.<br></br>I'II detect the language and you can then summarize or translate your text.</p>
              </div>
               <div className="outer-border">
                <div className="border-box">
                  <Globe className="globe"/>
                  <h3 className="language">Language Detection</h3>
                  <p className="lang-text">Automatically detect the language of your text</p>
                </div>

                 <div className="border-box">
                    <FileText className="file"/>
                    <h3 className="test">Text Summarization</h3>
                    <p className="test-text">Summarize long English texts (&gt;150 characters)</p>
                 </div>
                
                 <div className="border-box">
                    <Languages className="langs" />
                    <h3 className="Langugs">Translation</h3>
                    <p className="Langs-text">Translate to 6 different languages</p>
                 </div>
               </div>
            </div>
        </div>
        </>
    );
}