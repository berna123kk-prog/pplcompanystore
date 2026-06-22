import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { claimFirstAdmin, getMyRole } from "@/lib/admin.functions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Acesso administrativo" }, { name: "robots", content: "noindex" }] }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);

  const getMyRoleFn = useServerFn(getMyRole);
  const claimFn = useServerFn(claimFirstAdmin);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSessionUserId(session?.user?.id ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setSessionUserId(data.session?.user?.id ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!sessionUserId) {
      setIsAdmin(false);
      return;
    }
    setCheckingRole(true);
    getMyRoleFn()
      .then((r) => setIsAdmin(r.isAdmin))
      .catch(() => setIsAdmin(false))
      .finally(() => setCheckingRole(false));
  }, [sessionUserId, getMyRoleFn]);

  const claimMutation = useMutation({
    mutationFn: () => claimFn(),
    onSuccess: (res) => {
      if (res.claimed) {
        toast.success("Você agora é admin.");
        setIsAdmin(true);
      } else {
        toast.error("Já existe um admin no sistema.");
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        toast.success("Conta criada. Você já está logado.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (res.error) toast.error(res.error.message || "Falha no login com Google");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSessionUserId(null);
    toast.success("Sessão encerrada.");
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/5 border border-sky-200/30 rounded-lg p-6 shadow-xl">
        <h1 className="text-xl font-bold uppercase tracking-wide text-sky-900 mb-1">Acesso administrativo</h1>
        <p className="text-xs text-slate-500 mb-6">
          Faça login para gerenciar tamanhos esgotados.{" "}
          <Link to="/" className="underline">Voltar à loja</Link>
        </p>

        {sessionUserId ? (
          <div className="space-y-4">
            <p className="text-sm text-sky-900">Logado como <strong>{sessionUserId.slice(0, 8)}…</strong></p>
            <p className="text-sm">
              Status:{" "}
              {checkingRole ? (
                <span className="text-slate-500">verificando…</span>
              ) : isAdmin ? (
                <span className="text-emerald-600 font-bold">Admin ✓</span>
              ) : (
                <span className="text-amber-600 font-bold">Usuário comum</span>
              )}
            </p>
            {!isAdmin && (
              <button
                onClick={() => claimMutation.mutate()}
                disabled={claimMutation.isPending}
                className="w-full h-11 bg-sky-900 text-white text-sm font-bold uppercase tracking-wide rounded-sm disabled:opacity-50"
              >
                {claimMutation.isPending ? "Concedendo…" : "Tornar-me admin (1º admin)"}
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => navigate({ to: "/" })}
                className="w-full h-11 bg-emerald-600 text-white text-sm font-bold uppercase tracking-wide rounded-sm"
              >
                Ir para a loja
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="w-full h-11 border border-sky-200 text-sky-900 text-sm font-bold uppercase tracking-wide rounded-sm"
            >
              Sair
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`flex-1 h-9 text-xs font-bold uppercase rounded-sm ${mode === "signin" ? "bg-sky-900 text-white" : "border border-sky-200 text-sky-900"}`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 h-9 text-xs font-bold uppercase rounded-sm ${mode === "signup" ? "bg-sky-900 text-white" : "border border-sky-200 text-sky-900"}`}
              >
                Criar conta
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 text-sm bg-white border border-sky-200 rounded-sm text-sky-900"
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Senha (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 text-sm bg-white border border-sky-200 rounded-sm text-sky-900"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-sky-900 text-white text-sm font-bold uppercase tracking-wide rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "signin" ? "Entrar" : "Criar conta"}
              </button>
            </form>

            <div className="my-4 flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-400">
              <div className="flex-1 h-px bg-slate-200" />
              ou
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <button
              onClick={handleGoogle}
              className="w-full h-11 border border-sky-200 text-sky-900 text-sm font-bold uppercase tracking-wide rounded-sm"
            >
              Continuar com Google
            </button>
          </>
        )}
      </div>
    </main>
  );
}
