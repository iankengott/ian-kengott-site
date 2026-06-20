"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, Mail, Check, Loader2, ArrowUpRight, Clock } from "lucide-react";
import { PROFILE, SOCIALS } from "@/lib/data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("A valid email helps me reply."),
  message: z.string().min(10, "A few more words, please."),
});

type FormValues = z.infer<typeof schema>;

export function Connect() {
  const { toast } = useToast();
  const [done, setDone] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      toast({
        title: "Message received",
        description: data?.note ?? "Thanks — I'll get back to you.",
      });
      setDone(true);
      reset();
      setTimeout(() => setDone(false), 4000);
    } catch {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again, or reach me on GitHub.",
      });
    }
  };

  return (
    <section id="connect" className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: invitation */}
          <Reveal>
            <p className="eyebrow mb-2">Connect</p>
            <SectionHeading id="connect" className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Working on something careful and technical?
            </SectionHeading>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              I'm glad to talk research tooling, reproducible environments,
              spectromicroscopy workflows, or interesting infrastructure.
              Messages here stay on this server.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-[var(--copper)]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Typically replies within 48h
              </span>
            </div>

            <div className="my-8 hidden h-px w-full bg-gradient-to-r from-transparent via-[var(--copper)]/40 to-transparent lg:block" aria-hidden />

            <div className="mt-8 flex flex-col gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-between rounded-xl border border-border/60 bg-card/40 px-4 py-3 transition-colors hover:border-[var(--copper)]/50"
                >
                  <span className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[var(--copper)]" />
                    <span className="text-sm font-medium">{s.label}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--copper)]" />
                </a>
              ))}
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={0.08}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="glass relative rounded-2xl border border-border/70 p-6 sm:p-8"
              noValidate
            >
              {/* corner reticle accent */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
                <span className="absolute left-3 top-3 h-3.5 w-3.5 border-l border-t border-[var(--copper)]/40 rounded-tl" />
                <span className="absolute right-3 bottom-3 h-3.5 w-3.5 border-b border-r border-[var(--copper)]/40 rounded-br" />
              </div>
              <div className="relative grid gap-5">
                <Field label="Your name" error={errors.name?.message}>
                  <Input
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    className="bg-background/60"
                    {...register("name")}
                  />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <Input
                    type="email"
                    placeholder="you@lab.edu"
                    autoComplete="email"
                    className="bg-background/60"
                    {...register("email")}
                  />
                </Field>
                <Field label="Message" error={errors.message?.message}>
                  <Textarea
                    rows={5}
                    placeholder="A short note about what you're working on…"
                    className="resize-none bg-background/60"
                    {...register("message")}
                  />
                </Field>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="connect-send group relative h-11 w-full overflow-hidden rounded-full bg-[var(--copper)] text-[var(--copper-foreground)] hover:scale-[1.01] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </span>
                  ) : done ? (
                    <span className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4" /> Sent
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Send message
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  )}
                </Button>

                <p className="text-center font-mono text-[11px] text-muted-foreground">
                  No trackers · stored locally on this server
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="connect-field block">
      <span className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/80">
        {label}
      </span>
      {children}
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 block text-xs text-destructive"
        >
          {error}
        </motion.span>
      )}
    </label>
  );
}
