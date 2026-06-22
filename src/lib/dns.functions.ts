import { createServerFn } from "@tanstack/react-start";

const EXPECTED_IP = "185.158.133.1";

type CheckStatus = "ok" | "pendente" | "errado";

interface CheckResult {
  label: string;
  type: "A" | "TXT";
  name: string;
  expected: string;
  found: string[];
  status: CheckStatus;
}

async function resolve(name: string, type: "A" | "TXT"): Promise<{ Status: number; Answer?: Array<{ data: string; type: number }> }> {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`, {
      headers: { accept: "application/dns-json" },
    });
    if (!res.ok) return { Status: -1 };
    return await res.json();
  } catch {
    return { Status: -1 };
  }
}

async function checkA(name: string): Promise<CheckResult> {
  const r = await resolve(name, "A");
  const found = (r.Answer ?? []).map((a) => a.data.replace(/"/g, ""));
  let status: CheckStatus = "pendente";
  if (found.length > 0) {
    status = found.includes(EXPECTED_IP) ? "ok" : "errado";
  }
  return {
    label: `Registro A • ${name}`,
    type: "A",
    name,
    expected: EXPECTED_IP,
    found,
    status,
  };
}

async function checkTxt(name: string): Promise<CheckResult> {
  const r = await resolve(name, "TXT");
  const found = (r.Answer ?? []).map((a) => a.data.replace(/^"|"$/g, ""));
  let status: CheckStatus = "pendente";
  if (found.length > 0) {
    status = found.some((v) => v.toLowerCase().startsWith("lovable_verify=")) ? "ok" : "errado";
  }
  return {
    label: `Registro TXT • ${name}`,
    type: "TXT",
    name,
    expected: "lovable_verify=...",
    found,
    status,
  };
}

export const checkDomainDns = createServerFn({ method: "GET" }).handler(async () => {
  const domain = "pplcompanystore.com";
  const checks = await Promise.all([
    checkA(domain),
    checkA(`www.${domain}`),
    checkTxt(`_lovable.${domain}`),
    checkTxt(`_lovable.www.${domain}`),
  ]);
  const okCount = checks.filter((c) => c.status === "ok").length;
  return {
    domain,
    checkedAt: new Date().toISOString(),
    checks,
    okCount,
    total: checks.length,
    allOk: okCount === checks.length,
  };
});
