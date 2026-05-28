## Problema

No mobile o `<nav>` do `Header` (src/components/storefront.tsx) tem `hidden md:flex`, então as categorias (Vestuário, Kits, Acessórios, Slides, Sneakers, Perfumes) só aparecem no desktop.

## Solução

Adicionar uma segunda `<nav>` visível apenas no mobile (`md:hidden`) dentro da própria faixa azul do header, logo abaixo da linha do logo + ícones, centralizada como no desktop. Como são 6 itens e o viewport é ~384px, usar rolagem horizontal discreta (sem barra visível) para garantir que tudo caiba sem quebrar.

### Edição em `src/components/storefront.tsx` (função `Header`)

Inserir, entre o `</div>` da linha do logo/ícones e a `<div>` da linha divisória branca, o seguinte nav mobile:

```tsx
<nav className="md:hidden max-w-[1400px] mx-auto px-4 pb-3 -mt-2 flex items-center justify-center gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
  {navItems.map((item) => (
    <Link
      key={item.label}
      to="/colecoes/$slug"
      params={{ slug: item.slug }}
      className="text-[11px] font-bold uppercase tracking-[0.15em] text-white hover:text-white/80 py-1"
    >
      {item.label}
    </Link>
  ))}
</nav>
```

- Reaproveita o array `navItems` já existente.
- No mobile, subitens de "Vestuário" continuam acessíveis pela página da coleção (sem dropdown no mobile para manter simples).
- Desktop (`md:flex`) continua intocado.

Nenhuma alteração de rotas, dados ou lógica.
