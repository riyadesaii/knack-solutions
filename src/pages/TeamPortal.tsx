import { useState, useEffect } from "react";
import { Mail, Lock, LogIn, Inbox, LogOut, PenSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { teamLogin, fetchInbox, fetchEmailBody, sendEmail, EmailMessage } from "@/lib/api";

const TeamPortal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<EmailMessage[] | null>(null);
  const [viewingMail, setViewingMail] = useState<EmailMessage | null>(null);
  const [mailBody, setMailBody] = useState<{ body: string; html: string | null } | null>(null);
  const [bodyLoading, setBodyLoading] = useState(false);
  const [loggedInAs, setLoggedInAs] = useState("");
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [composing, setComposing] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeFiles, setComposeFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("teamEmail");
    const savedPassword = sessionStorage.getItem("teamPassword");
    if (savedEmail && savedPassword) {
      setLoading(true);
      fetchInbox(savedEmail, savedPassword)
        .then((inbox) => {
          setEmails(inbox);
          setLoggedInAs(savedEmail);
          setCreds({ email: savedEmail, password: savedPassword });
        })
        .catch(() => {
          sessionStorage.removeItem("teamEmail");
          sessionStorage.removeItem("teamPassword");
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await teamLogin(email, password);
      const inbox = await fetchInbox(email, password);
      setEmails(inbox);
      setLoggedInAs(email);
      setCreds({ email, password });
      sessionStorage.setItem("teamEmail", email);
      sessionStorage.setItem("teamPassword", password);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setEmails(null);
    setEmail("");
    setPassword("");
    setLoggedInAs("");
    setComposing(false);
    setCreds({ email: "", password: "" });
    sessionStorage.removeItem("teamEmail");
    sessionStorage.removeItem("teamPassword");
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await sendEmail({ email: creds.email, password: creds.password, to: composeTo, subject: composeSubject, body: composeBody, attachments: composeFiles });
      toast.success("Email sent successfully");
      setComposing(false);
      setComposeTo(""); setComposeSubject(""); setComposeBody(""); setComposeFiles([]);
    } catch (err: any) {
      toast.error(err.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const openMail = (mail: EmailMessage) => {
    setViewingMail(mail);
    setMailBody(null);
    setBodyLoading(true);
    fetchEmailBody(mail.id, creds.email, creds.password)
      .then(setMailBody)
      .catch(() => setMailBody({ body: "(Failed to load)", html: null }))
      .finally(() => setBodyLoading(false));
  };

  if (emails !== null) {
    return (
      <div className="min-h-screen pt-24 bg-orange-50/30">

        {/* Compose Modal */}
        {composing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h3 className="font-semibold text-foreground">New Message</h3>
                <button onClick={() => setComposing(false)}><X size={18} /></button>
              </div>
              <form onSubmit={handleSend} className="p-5 space-y-3">
                <Input placeholder="To" value={composeTo} onChange={(e) => setComposeTo(e.target.value)} required />
                <Input placeholder="Subject" value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} required />
                <Textarea placeholder="Write your message..." value={composeBody} onChange={(e) => setComposeBody(e.target.value)} rows={6} required />
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Attachments (optional)</label>
                  <input type="file" multiple onChange={(e) => setComposeFiles(Array.from(e.target.files || []))}
                    className="text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground cursor-pointer w-full" />
                  {composeFiles.length > 0 && <p className="text-xs text-muted-foreground mt-1">{composeFiles.length} file(s) selected</p>}
                </div>
                <Button type="submit" className="w-full" disabled={sending}>
                  <Send size={14} className="mr-2" />{sending ? "Sending..." : "Send"}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Email Viewer Modal */}
        {viewingMail && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-xl font-bold text-foreground mb-2">{viewingMail.subject}</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                      {viewingMail.sender.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{viewingMail.sender}</p>
                      <p className="text-xs text-muted-foreground">{viewingMail.date}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => { setViewingMail(null); setMailBody(null); }} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted shrink-0">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                {bodyLoading ? (
                  <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading...</div>
                ) : mailBody?.html ? (
                  <iframe
                    srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:20px;font-family:Arial,sans-serif;line-height:1.6;}img{max-width:100%;}a{color:#f97316;}</style></head><body>${mailBody.html}</body></html>`}
                    sandbox="allow-same-origin allow-popups"
                    className="w-full border-0"
                    style={{ height: '60vh' }}
                    title="email-body"
                  />
                ) : (
                  <div className="px-6 py-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{mailBody?.body || "(No content)"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                <Inbox size={22} className="text-orange-500" /> Inbox
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">{loggedInAs}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setComposing(true)}>
                <PenSquare size={14} className="mr-2" /> Compose
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut size={14} className="mr-2" /> Sign Out
              </Button>
            </div>
          </div>

          {emails.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No emails found.</div>
          ) : (
            <div className="space-y-1">
              {emails.map((mail) => (
                <div
                  key={mail.id}
                  onClick={() => openMail(mail)}
                  className="bg-white rounded-xl border border-border/60 px-5 py-4 flex items-start gap-4 cursor-pointer hover:bg-orange-50 hover:border-orange-200 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0 mt-0.5">
                    {mail.sender.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="font-semibold text-sm text-foreground truncate">{mail.sender.replace(/<.*>/g, '').trim() || mail.sender}</p>
                      <span className="text-xs text-muted-foreground shrink-0">{mail.date.slice(0, 16)}</span>
                    </div>
                    <p className="text-sm text-foreground truncate font-medium">{mail.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-orange-50/30">
      <div className="w-full max-w-sm mx-4 bg-white rounded-2xl border border-border/60 shadow-card p-8 space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-orange-100 flex items-center justify-center">
            <Mail size={26} className="text-orange-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Knack Team Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to view your inbox</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input type="email" placeholder="Your work email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" required />
          </div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn size={16} className="mr-2" />
            {loading ? "Loading inbox..." : "Open Inbox"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TeamPortal;
