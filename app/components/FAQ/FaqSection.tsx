import { FaqItem } from "./FaqItem";

export const FaqSection = () => {
     return (
    <div className="space-y-4 w-full mt-20 mx-auto flex items-center flex-col">
      <h2 className="text-center text-xl font-bold mb-6">Perguntas Frequentes</h2>
      <FaqItem
        title="Quais cidades você atende?"
        description="Atendo principalmente na região metropolitana, mas podemos negociar deslocamentos para outras cidades."
      />
      <FaqItem
        title="Pagamos outra taxa por você vir até o local?"
        description="Depende da distância. Em locais mais próximos não há taxa extra, mas viagens longas podem ter custo adicional."
      />
      <FaqItem
        title="Você atua com casas/prédios antigos?"
        description="Prefiro atuar em imóveis a partir de 1970. Em construções mais antigas, preciso verificar pessoalmente a viabilidade."
      />
      <FaqItem
        title="Tem como pedir reembolso?"
        description="Sim, caso o serviço não seja realizado conforme o combinado, há possibilidade de solicitar reembolso."
      />
    </div>
  );
};


