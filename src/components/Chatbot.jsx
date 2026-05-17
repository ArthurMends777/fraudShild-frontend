import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import './Chatbot.css'

const botResponses = {
  golpe: 'Golpes digitais geralmente usam urgencia, prometem premios ou pedem dados pessoais. Desconfie de mensagens que pedem acao imediata ou oferecem algo bom demais para ser verdade.',
  phishing: 'Phishing e uma tecnica onde criminosos se passam por empresas legitimas para roubar seus dados. Verifique sempre o remetente e nunca clique em links suspeitos.',
  'fake news': 'Para identificar fake news, verifique a fonte, procure a noticia em veiculos confiaveis, observe se ha erros de portugues e desconfie de titulos muito sensacionalistas.',
  link: 'Links suspeitos geralmente tem dominios estranhos, erros de escrita ou redirecionamentos. Use nossa ferramenta de analise para verificar links antes de clicar.',
  seguranca: 'Dicas de seguranca: use senhas fortes e unicas, ative autenticacao em dois fatores, mantenha seus dispositivos atualizados e nunca compartilhe dados pessoais em sites nao confiaveis.',
  denuncia: 'Para denunciar golpes, voce pode registrar um boletim de ocorrencia online, denunciar no Procon ou usar a plataforma consumidor.gov.br.',
  pix: 'Golpes via PIX sao comuns. Nunca faca transferencias por pressao, verifique sempre os dados do destinatario e desconfie de pedidos urgentes de dinheiro.',
  email: 'E-mails fraudulentos geralmente tem erros de portugues, remetentes estranhos e links suspeitos. Nunca abra anexos de remetentes desconhecidos.',
  default: 'Sou o assistente FraudShield! Posso te ajudar com informacoes sobre golpes digitais, fake news, phishing e seguranca online. O que gostaria de saber?'
}

function getBotResponse(message) {
  const lower = message.toLowerCase()
  for (const [key, value] of Object.entries(botResponses)) {
    if (key !== 'default' && lower.includes(key)) {
      return value
    }
  }
  return botResponses.default
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Ola! Sou o assistente FraudShield. Como posso te ajudar hoje?' }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    const botMsg = { from: 'bot', text: getBotResponse(input) }
    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <>
      {!isOpen && (
        <button className="chatbot-fab" onClick={() => setIsOpen(true)}>
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <MessageCircle size={18} />
              <span>FraudShield Bot</span>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua pergunta..."
            />
            <button onClick={handleSend}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
