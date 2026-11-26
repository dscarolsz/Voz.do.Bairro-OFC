const CATEGORIAS = [
  "Segurança",
  "Infraestrutura",
  "Iluminação",
  "Limpeza",
  "Enchentes",
  "Animais",
  "Outro"
];

const SITUACOES = ["Aberta", "Em andamento", "Resolvida"];

const DADOS_INICIAIS = {
  sessaoUsuarioId: null,
  usuarios: [],
  acessibilidade: {
    fontScale: 1,
    highContrast: false,
    underlineLinks: false,
    reduceMotion: false
  },
  ocorrencias: [],
  eventosSamba: [
    { titulo: "Samba da Praça", dia: "Sábado · 16h", local: "Praça Central", tipo: "Samba", foto: "../img/samba_da_praca.png" },
    { titulo: "Samba da Vó", dia: "Domingo · 14h", local: "Largo da Matriz", tipo: "Samba", foto: "../img/samba_da_vo.png" },
    { titulo: "Pagode da Vila Nova", dia: "Sábado · 17h30", local: "Rua Sete, 300", tipo: "Samba", foto: "../img/pagode_vila_nova.png" },
    { titulo: "Samba de Mesa do Mercado", dia: "Domingo · 12h", local: "Mercado Comunitário", tipo: "Samba", foto: "../img/samba_mesa_mercado.png" }
  ],
  comercios: [
    {
      nome: "Padaria do Seu Tonho",
      categoria: "Panificação & Café",
      descricao: "Pão quente às 6h, café coado na hora e desconto para idosos toda terça.",
      selo: "Apoia o Voz do Bairro",
      foto: ""
    },
    {
      nome: "Mercearia & Hortifrúti da Praça",
      categoria: "Alimentos Frescos",
      descricao: "Verduras frescas, entregas a pé na vizinhança e apoio direto aos projetos da comunidade.",
      selo: "Parceiro Local",
      foto: ""
    },
    {
      nome: "Oficina & Bicicletaria do Beto",
      categoria: "Mobilidade",
      descricao: "Manutenção de bikes, calibragem gratuita e peças acessíveis para quem se move pelo bairro.",
      selo: "Comércio Parceiro",
      foto: ""
    }
  ],
  equipe: [
    {
      nome: "Ana Carolina",
      papel: "Full-Stack, Mural, Dados & Acessibilidade",
      bio: "Desenvolve e mantém as telas e os dados do portal, organiza o fluxo do mural de ocorrências e cuida da acessibilidade para que qualquer morador consiga usar.",
      foto: "../img/ana-carolina.jpg"
    },
    {
      nome: "Júlia Martins",
      papel: "Coordenação & Escuta Comunitária",
      bio: "Acompanha ocorrências do mural, organiza mutirões e garante que o registro do morador vire cobrança real.",
      foto: "../img/julia-martins.jpg"
    },
    {
      nome: "Isabelly Silva",
      papel: "Comunicação, Mural & Mobilização",
      bio: "Ajuda a divulgar os avisos do bairro, organiza o diálogo com os moradores e fortalece a participação comunitária.",
      foto: ""
    },
    {
      nome: "Ryan da Silva",
      papel: "Cultura, Samba & Integração",
      bio: "Reúne jovens, famílias e idosos nas rodas de samba de fim de semana e na preservação da história do bairro.",
      foto: ""
    },
    {
      nome: "Marco Aurélio",
      papel: "Parcerias Locais & Acompanhamento",
      bio: "Acompanha o andamento das demandas no mural e ajuda a conectar o projeto com iniciativas e apoios do bairro.",
      foto: ""
    },
    {
      nome: "Paula Oliveira",
      papel: "Apoio aos Moradores & Cuidado Comunitário",
      bio: "Auxilia os moradores no registro claro das ocorrências e cuida da escuta ativa de quem precisa de ajuda no dia a dia.",
      foto: ""
    }
  ],
  patrocinadores: [
    {
      nome: "Rede Popular de Materiais",
      nivel: "Patrocinador Ouro",
      descricao: "Ajuda a manter a rede comunitária no ar e apoia ações de melhoria nas ruas.",
      foto: "../img/patrocinador-rede-popular.png"
    },
    {
      nome: "Farmácia Bem Estar",
      nivel: "Patrocinador Prata",
      descricao: "Apoia iniciativas de acessibilidade e cuidado com os moradores e idosos do bairro.",
      foto: "../img/patrocinador-farmacia-bem-estar.png"
    },
    {
      nome: "Kaique Aleixo",
      nivel: "Patrocinador · Back-End & Infraestrutura",
      descricao: "Atua no back-end e apoia a manutenção técnica da plataforma para ajudar a manter o site no ar com estabilidade.",
      foto: "../img/patrocinador-kaique.jpg"
    }
  ]
};