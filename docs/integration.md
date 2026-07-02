# Guia de Integração - Supabase, Firebase & WhatsApp

Este documento fornece instruções técnicas sobre como conectar a estrutura do MVP (que atualmente utiliza estado persistente local) a bancos de dados em nuvem em tempo real e APIs de notificação.

---

## 1. Integração com Supabase (Tempo Real)

O Supabase é ideal para este projeto, pois fornece um banco de dados PostgreSQL com recursos nativos de WebSockets em tempo real (Realtime).

### Mapeamento de Tabelas
As tabelas no PostgreSQL devem refletir as entidades definidas no TypeScript:
* `mesas`: `numero_mesa` (text), `capacidade_maxima` (int), `status_atual` (text), `setor_ou_area` (text).
* `fila_clientes`: `nome_cliente` (text), `whatsapp` (text), `quantidade_pessoas` (int), `status` (text), `horario_entrada` (timestamp).
* `historico_atendimentos`: histórico final para auditoria e métricas.

### Implementação com React Context
Substitua os métodos de atualização do `QueueContext` por chamadas ao cliente Supabase.

Exemplo de cadastro de cliente (`adicionarClienteNaFila`):
```typescript
import { createClient } from '@supabase/supabase-base';

const supabase = createClient('SUA_URL_SUPABASE', 'SUA_CHAVE_ANONIMA');

const adicionarClienteNaFila = async (nome: string, whatsapp: string, quantidade: number, observacoes: string) => {
  const { data, error } = await supabase
    .from('fila_clientes')
    .insert([
      { 
        nome_cliente: nome, 
        whatsapp, 
        quantidade_pessoas: quantidade, 
        observacoes,
        status: 'aguardando',
        horario_entrada: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### Escuta de Eventos em Tempo Real (Realtime Channels)
Para atualizar o painel da Recepção e a tela do Cliente de forma automática:
```typescript
useEffect(() => {
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'fila_clientes' },
      (payload) => {
        // Recarregar dados ou atualizar estado local de forma incremental
        setFilaClientes((prev) => {
          if (payload.eventType === 'INSERT') return [...prev, payload.new as FilaCliente];
          if (payload.eventType === 'UPDATE') {
            return prev.map(c => c.id === payload.new.id ? (payload.new as FilaCliente) : c);
          }
          if (payload.eventType === 'DELETE') return prev.filter(c => c.id !== payload.old.id);
          return prev;
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## 2. Integração com Firebase (Cloud Firestore)

Se optar pelo Firebase, o **Cloud Firestore** possui escutas nativas (`onSnapshot`) altamente otimizadas para aplicações mobile e web.

### Exemplo de Escuta de Mudança nas Mesas
Para o garçom e recepção verem alterações de status em tempo real:
```typescript
import { db } from './firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "mesas"), (snapshot) => {
    const mesasData: Mesa[] = [];
    snapshot.forEach((doc) => {
      mesasData.push({ id: doc.id, ...doc.data() } as Mesa);
    });
    setMesas(mesasData);
  });

  return () => unsubscribe();
}, []);
```

---

## 3. Integração com WhatsApp (Notificações de Fila)

Para disparar mensagens automáticas quando o cliente for chamado, utilize a **API Oficial do WhatsApp Business (Cloud API)** ou integradores licenciados (como Z-API, Evolution API).

### Fluxo de Disparo
1. O Atendente da recepção clica em **"Chamar Cliente"**.
2. O status do cliente muda para `chamado`.
3. Um webhook ou uma função serverless (ex: Supabase Edge Functions ou Firebase Cloud Functions) é disparada.
4. A função realiza um `POST` para a API do WhatsApp enviando a notificação.

### Exemplo de Cloud Function para Disparo
```javascript
const axios = require('axios');

exports.notificarClienteFila = async (req, res) => {
  const { whatsapp, nomeCliente, numeroMesa } = req.body;

  // URL e token do WhatsApp Business Cloud API
  const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  const data = {
    messaging_product: "whatsapp",
    to: whatsapp, // formato DDI + DDD + Número (ex: 5511999998888)
    type: "template",
    template: {
      name: "mesa_pronta_notificacao", // Nome do template aprovado no Meta
      language: {
        code: "pt_BR"
      },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: nomeCliente },
            { type: "text", text: numeroMesa }
          ]
        }
      ]
    }
  };

  try {
    await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.response ? error.response.data : error.message);
    return res.status(500).send({ error: error.message });
  }
};
```

### Template Recomendado no Meta
> *"Olá, {{1}}! Sua mesa ({{2}}) já está pronta e aguardando por você na entrada. Dirija-se à recepção para ser acomodado. Bom apetite!"*
