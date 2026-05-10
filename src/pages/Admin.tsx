import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, LogOut, Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  fetchProducts, addProduct, deleteProduct, updateProduct,
  fetchClients, addClient, deleteClient,
  fetchServices, addService, deleteService, updateService,
  fetchTeam, addTeamMember, deleteTeamMember,
  fetchCategories, addCategory, deleteCategory,
  fetchServiceCategories, addServiceCategory, deleteServiceCategory, BASE_URL,
} from "@/lib/api";

const ADMIN_KEY = "Shreedutt@7371";

const Admin = () => {
  const navigate = useNavigate();
  const [keyInput, setKeyInput] = useState("");
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("adminKey") === ADMIN_KEY);

  // Block direct URL access — must come via the 5-click trigger
  useEffect(() => {
    if (sessionStorage.getItem("adminAccess") !== "true") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = () => {
    if (keyInput === ADMIN_KEY) {
      sessionStorage.setItem("adminKey", ADMIN_KEY);
      setAuthed(true);
    } else {
      alert("Invalid admin key");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminKey");
    sessionStorage.removeItem("adminAccess");
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-full max-w-sm p-8 rounded-xl border bg-card shadow-card space-y-4">
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="text-sm text-muted-foreground">Enter the admin key to continue.</p>
          <Input
            type="password"
            placeholder="Admin key"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <Button className="w-full" onClick={handleLogin}>Login</Button>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const qc = useQueryClient();
  const { toast } = useToast();

  // Products state
  const [pName, setPName] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pImage, setPImage] = useState<File | null>(null);
  const [pCategory, setPCategory] = useState("");
  const pImageRef = useRef<HTMLInputElement>(null);

  // Edit product state
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editPName, setEditPName] = useState("");
  const [editPDesc, setEditPDesc] = useState("");
  const [editPImage, setEditPImage] = useState<File | null>(null);
  const [editPCategory, setEditPCategory] = useState("");
  const editPImageRef = useRef<HTMLInputElement>(null);

  // Category state
  const [catName, setCatName] = useState("");

  // Service Category state
  const [sCatName, setSCatName] = useState("");

  // Clients state
  const [cName, setCName] = useState("");
  const [cLogo, setCLogo] = useState<File | null>(null);
  const cLogoRef = useRef<HTMLInputElement>(null);

  // Services state
  const [sName, setSName] = useState("");
  const [sDesc, setSDesc] = useState("");
  const [sImage, setSImage] = useState<File | null>(null);
  const [sCategory, setSCategory] = useState("");
  const sImageRef = useRef<HTMLInputElement>(null);

  // Edit service state
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [editSName, setEditSName] = useState("");
  const [editSDesc, setEditSDesc] = useState("");
  const [editSImage, setEditSImage] = useState<File | null>(null);
  const [editSCategory, setEditSCategory] = useState("");
  const editSImageRef = useRef<HTMLInputElement>(null);

  // Team state
  const [tEmail, setTEmail] = useState("");
  const [tPortalPass, setTPortalPass] = useState("");
  const [tAppPass, setTAppPass] = useState("");

  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: fetchClients });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const { data: team = [] } = useQuery({ queryKey: ["team"], queryFn: fetchTeam });
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: serviceCategories = [] } = useQuery({ queryKey: ["serviceCategories"], queryFn: fetchServiceCategories });

  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      setPName(""); setPDesc(""); setPImage(null); setPCategory("");
      if (pImageRef.current) pImageRef.current.value = "";
      toast({ title: "Product added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, fd }: { id: string; fd: FormData }) => updateProduct(id, fd),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      setEditProductId(null);
      if (editPImageRef.current) editPImageRef.current.value = "";
      toast({ title: "Product updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product deleted" });
    },
  });

  const addClientMutation = useMutation({
    mutationFn: addClient,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      setCName(""); setCLogo(null);
      if (cLogoRef.current) cLogoRef.current.value = "";
      toast({ title: "Client added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteClientMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast({ title: "Client deleted" });
    },
  });

  const addServiceMutation = useMutation({
    mutationFn: addService,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      setSName(""); setSDesc(""); setSImage(null); setSCategory("");
      if (sImageRef.current) sImageRef.current.value = "";
      toast({ title: "Service added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateService(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      setEditServiceId(null);
      if (editSImageRef.current) editSImageRef.current.value = "";
      toast({ title: "Service updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteServiceMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      toast({ title: "Service deleted" });
    },
  });

  const addTeamMutation = useMutation({
    mutationFn: addTeamMember,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["team"] });
      setTEmail(""); setTPortalPass(""); setTAppPass("");
      toast({ title: "Team member added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteTeamMutation = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["team"] });
      toast({ title: "Team member removed" });
    },
  });

  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setCatName("");
      toast({ title: "Category added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  const addServiceCategoryMutation = useMutation({
    mutationFn: addServiceCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["serviceCategories"] });
      setSCatName("");
      toast({ title: "Service category added" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteServiceCategoryMutation = useMutation({
    mutationFn: deleteServiceCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["serviceCategories"] }),
  });

  const handleAddProduct = () => {
    if (!pName.trim()) return toast({ title: "Name is required", variant: "destructive" });
    if (!pImage) return toast({ title: "Product image is required", variant: "destructive" });
    const fd = new FormData();
    fd.append("name", pName);
    fd.append("description", pDesc);
    fd.append("category", pCategory);
    if (pImage) fd.append("image", pImage);
    addProductMutation.mutate(fd);
  };

  const handleUpdateProduct = () => {
    if (!editProductId) return;
    if (!editPName.trim()) return toast({ title: "Name is required", variant: "destructive" });
    const fd = new FormData();
    fd.append("name", editPName);
    fd.append("description", editPDesc);
    fd.append("category", editPCategory);
    if (editPImage) fd.append("image", editPImage);
    updateProductMutation.mutate({ id: editProductId, fd });
  };

  const handleAddClient = () => {
    if (!cName.trim()) return toast({ title: "Client name is required", variant: "destructive" });
    if (!cLogo) return toast({ title: "Client logo is required", variant: "destructive" });
    const fd = new FormData();
    fd.append("name", cName);
    if (cLogo) fd.append("logo", cLogo);
    addClientMutation.mutate(fd);
  };

  const handleAddService = () => {
    if (!sName.trim()) return toast({ title: "Service name is required", variant: "destructive" });
    const fd = new FormData();
    fd.append("name", sName);
    fd.append("description", sDesc);
    fd.append("category", sCategory);
    if (sImage) fd.append("image", sImage);
    addServiceMutation.mutate(fd);
  };

  const handleUpdateService = () => {
    if (!editServiceId) return;
    if (!editSName.trim()) return toast({ title: "Name is required", variant: "destructive" });
    const fd = new FormData();
    fd.append("name", editSName);
    fd.append("description", editSDesc);
    fd.append("category", editSCategory);
    if (editSImage) fd.append("image", editSImage);
    updateServiceMutation.mutate({ id: editServiceId, data: fd });
  };

  const handleAddTeamMember = () => {
    if (!tEmail.trim()) return toast({ title: "Email is required", variant: "destructive" });
    if (!tPortalPass.trim()) return toast({ title: "Portal password is required", variant: "destructive" });
    if (!tAppPass.trim()) return toast({ title: "App password is required", variant: "destructive" });
    addTeamMutation.mutate({ email: tEmail, portal_password: tPortalPass, app_password: tAppPass });
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Products Section */}
          <div className="space-y-6">
            <h2 className="font-display text-xl font-semibold text-foreground border-b pb-3">Products</h2>

            {/* Add Product Form */}
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Add Product</h3>
              <Input placeholder="Name *" value={pName} onChange={(e) => setPName(e.target.value)} />
              <Textarea placeholder="Description" value={pDesc} onChange={(e) => setPDesc(e.target.value)} rows={3} />
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                <select
                  value={pCategory}
                  onChange={(e) => setPCategory(e.target.value)}
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground"
                >
                  <option value="">-- No Category --</option>
                  {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Product Image</label>
                <input
                  ref={pImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPImage(e.target.files?.[0] || null)}
                  className="text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
              </div>
              <Button onClick={handleAddProduct} disabled={addProductMutation.isPending} className="w-full">
                <Plus size={16} className="mr-2" />
                {addProductMutation.isPending ? "Adding..." : "Add Product"}
              </Button>
            </div>

            {/* Products List */}
            <div className="space-y-3">
              {products.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No products yet.</p>
              )}
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border bg-card space-y-3">
                  {editProductId === p.id ? (
                    <>
                      <Input value={editPName} onChange={(e) => setEditPName(e.target.value)} placeholder="Name *" />
                      <Textarea value={editPDesc} onChange={(e) => setEditPDesc(e.target.value)} placeholder="Description" rows={2} />
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                        <select
                          value={editPCategory}
                          onChange={(e) => setEditPCategory(e.target.value)}
                          className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground"
                        >
                          <option value="">-- No Category --</option>
                          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">New Image (optional)</label>
                        <input
                          ref={editPImageRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => setEditPImage(e.target.files?.[0] || null)}
                          className="text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateProduct} disabled={updateProductMutation.isPending} className="flex-1">
                          <Check size={14} className="mr-1" /> {updateProductMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditProductId(null)}>
                          <X size={14} />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      {p.image && <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => { setEditProductId(p.id); setEditPName(p.name); setEditPDesc(p.description); setEditPCategory(p.category || ""); setEditPImage(null); }}>
                        <Pencil size={15} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteProductMutation.mutate(p.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Clients Section */}
          <div className="space-y-6">
            <h2 className="font-display text-xl font-semibold text-foreground border-b pb-3">Clients</h2>

            {/* Add Client Form */}
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Add Client</h3>
              <Input placeholder="Client Name *" value={cName} onChange={(e) => setCName(e.target.value)} />
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Client Logo</label>
                <input
                  ref={cLogoRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCLogo(e.target.files?.[0] || null)}
                  className="text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
              </div>
              <Button onClick={handleAddClient} disabled={addClientMutation.isPending} className="w-full">
                <Plus size={16} className="mr-2" />
                {addClientMutation.isPending ? "Adding..." : "Add Client"}
              </Button>
            </div>

            {/* Clients List */}
            <div className="space-y-3">
              {clients.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No clients yet.</p>
              )}
              {clients.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-4 rounded-xl border bg-card">
                  {c.logo ? (
                    <img
                      src={c.logo}
                      alt={c.name}
                      className="w-14 h-14 rounded-lg object-contain flex-shrink-0 bg-muted p-1"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-muted-foreground">No logo</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{c.name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    onClick={() => deleteClientMutation.mutate(c.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-10 space-y-6">
          <h2 className="font-display text-xl font-semibold text-foreground border-b pb-3">Services</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Add Service</h3>
              <Input placeholder="Service Name *" value={sName} onChange={(e) => setSName(e.target.value)} />
              <Textarea placeholder="Description" value={sDesc} onChange={(e) => setSDesc(e.target.value)} rows={3} />
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                <select
                  value={sCategory}
                  onChange={(e) => setSCategory(e.target.value)}
                  className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground"
                >
                  <option value="">-- No Category --</option>
                  {serviceCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Service Image (optional)</label>
                <input
                  ref={sImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSImage(e.target.files?.[0] || null)}
                  className="text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
              </div>
              <Button onClick={handleAddService} disabled={addServiceMutation.isPending} className="w-full">
                <Plus size={16} className="mr-2" />
                {addServiceMutation.isPending ? "Adding..." : "Add Service"}
              </Button>
            </div>
            <div className="space-y-3">
              {services.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No services yet.</p>
              )}
              {services.map((s) => (
                <div key={s.id} className="p-4 rounded-xl border bg-card space-y-3">
                  {editServiceId === s.id ? (
                    <>
                      <Input value={editSName} onChange={(e) => setEditSName(e.target.value)} placeholder="Name *" />
                      <Textarea value={editSDesc} onChange={(e) => setEditSDesc(e.target.value)} placeholder="Description" rows={2} />
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                        <select
                          value={editSCategory}
                          onChange={(e) => setEditSCategory(e.target.value)}
                          className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground"
                        >
                          <option value="">-- No Category --</option>
                          {serviceCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">New Image (optional)</label>
                        <input
                          ref={editSImageRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => setEditSImage(e.target.files?.[0] || null)}
                          className="text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateService} disabled={updateServiceMutation.isPending} className="flex-1">
                          <Check size={14} className="mr-1" /> {updateServiceMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditServiceId(null)}>
                          <X size={14} />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      {s.image && <img src={s.image} alt={s.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => { setEditServiceId(s.id); setEditSName(s.name); setEditSDesc(s.description); setEditSCategory(s.category || ""); setEditSImage(null); }}>
                        <Pencil size={15} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteServiceMutation.mutate(s.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-10 space-y-6">
          <h2 className="font-display text-xl font-semibold text-foreground border-b pb-3">Product Categories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Add Category</h3>
              <Input placeholder="Category Name *" value={catName} onChange={(e) => setCatName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCategoryMutation.mutate(catName)} />
              <Button onClick={() => { if (catName.trim()) addCategoryMutation.mutate(catName); }} disabled={addCategoryMutation.isPending} className="w-full">
                <Plus size={16} className="mr-2" />
                {addCategoryMutation.isPending ? "Adding..." : "Add Category"}
              </Button>
            </div>
            <div className="space-y-3">
              {categories.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No categories yet.</p>}
              {categories.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-4 rounded-xl border bg-card">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{c.name}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteCategoryMutation.mutate(c.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Categories Section */}
        <div className="mt-10 space-y-6">
          <h2 className="font-display text-xl font-semibold text-foreground border-b pb-3">Service Categories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Add Service Category</h3>
              <Input placeholder="Category Name *" value={sCatName} onChange={(e) => setSCatName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addServiceCategoryMutation.mutate(sCatName)} />
              <Button onClick={() => { if (sCatName.trim()) addServiceCategoryMutation.mutate(sCatName); }} disabled={addServiceCategoryMutation.isPending} className="w-full">
                <Plus size={16} className="mr-2" />
                {addServiceCategoryMutation.isPending ? "Adding..." : "Add Service Category"}
              </Button>
            </div>
            <div className="space-y-3">
              {serviceCategories.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No service categories yet.</p>}
              {serviceCategories.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-4 rounded-xl border bg-card">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{c.name}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteServiceCategoryMutation.mutate(c.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-10 space-y-6">
          <h2 className="font-display text-xl font-semibold text-foreground border-b pb-3">Knack Team Access</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="p-6 rounded-xl border bg-card space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Add Team Member</h3>
              <Input type="email" placeholder="Gmail Address *" value={tEmail} onChange={(e) => setTEmail(e.target.value)} />
              <Input type="password" placeholder="Portal Password (for employee login) *" value={tPortalPass} onChange={(e) => setTPortalPass(e.target.value)} />
              <Input type="password" placeholder="Gmail App Password (16 chars) *" value={tAppPass} onChange={(e) => setTAppPass(e.target.value)} />
              <p className="text-xs text-muted-foreground">App Password: Google Account → Security → App Passwords</p>
              <Button onClick={handleAddTeamMember} disabled={addTeamMutation.isPending} className="w-full">
                <Plus size={16} className="mr-2" />
                {addTeamMutation.isPending ? "Adding..." : "Add Member"}
              </Button>
            </div>
            <div className="space-y-3">
              {team.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No team members yet.</p>
              )}
              {team.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-4 rounded-xl border bg-card">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{m.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    onClick={() => deleteTeamMutation.mutate(m.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
