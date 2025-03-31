import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  LayoutDashboard,
  User,
  BarChart3,
  ClipboardList,
  Store,
  UploadCloud,
  LogOut,
  Headset,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api, { API_ROUTES } from "../utils/api";
import OrganizationModal from "./orgModal"; // Modal component for organization details

interface SidebarLink {
  title: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

const Sidebar = ({
  isExpanded,
  setIsExpanded,
  userRole,
}: {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  userRole: string;
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [organization, setOrganization] = useState<{
    name: string;
    logo: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Fetch organization details
  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(API_ROUTES.ORGANIZATION, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrganization(response.data);
      } catch (error) {
        console.error("Failed to fetch organization details:", error);
      }
    };

    fetchOrganizationDetails();
  }, []);

  // Define the links with role-based access
  const links: SidebarLink[] = [
    { title: "Summary Report", path: "/dashboard/summary-report", icon: LayoutDashboard, roles: ["admin"] },
    {
      title: "Non-Buying Customers",
      path: "/dashboard/non-buying-customers",
      icon: User,
      roles: ["admin"],
    },
    {
      title: "Monthly Non-Buying",
      path: "/dashboard/non-buying-monthly-customers",
      icon: ClipboardList,
      roles: ["admin"],
    },
    {
      title: "Order History",
      path: "/dashboard/telecaller-remarks-orders",
      icon: ClipboardList,
      roles: ["tellecaller"],
    },
    { title: "Customer Report", path: "/dashboard/customer-report", icon: BarChart3, roles: ["admin"] },
    { title: "Store Sales Report", path: "/dashboard/store-sales-report", icon: Store, roles: ["admin"] },
    { title: "Upload", path: "/dashboard/upload", icon: UploadCloud, roles: ["admin"] },
    { title: "User Creation", path: "/dashboard/user", icon: User, roles: ["admin"] },
    { title: "Tellecalling", path: "/dashboard/tellecalling", icon: User, roles: ["tellecaller"] },
    { title: "Tellecaller", path: "/dashboard/telecalling-dashboard", icon: Headset, roles: ["admin"] },
  ];

  // Filter links based on the user's role
  const filteredLinks = links.filter((link) => link.roles.includes(userRole));

  const isActivePath = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Variants for animations
  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5rem" },
  };

  const mobileMenuButtonVariants = {
    rest: { scale: 1, backgroundColor: "#ffffff" },
    hover: { scale: 1.1, backgroundColor: "#f0f9ff" },
    tap: { scale: 0.9 }
  };

  const itemVariants = {
    hover: { scale: 1.03, x: 5 },
    initial: { scale: 1, x: 0 },
  };

  const logoTextVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -20 },
  };

  const titleVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -10 },
  };

  const logoContainerVariants = {
    rest: { y: 0 },
    hover: { y: -3, transition: { duration: 0.3, type: "spring", stiffness: 400 } }
  };

  const logoImageVariants = {
    rest: { rotate: 0 },
    hover: { rotate: 10, transition: { duration: 0.5 } }
  };

  const linkContainerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.5, duration: 0.4 }
    }
  };

  return (
    <>
      {/* Mobile Menu Button with enhanced animation */}
      <motion.button
        type="button"
        className="fixed z-50 p-2 bg-white rounded-lg shadow-lg top-4 left-4 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        variants={mobileMenuButtonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        <Menu size={24} className="text-blue-800" />
      </motion.button>

      {/* Mobile Overlay with improved fade animation */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Sidebar - Desktop and Mobile */}
      <motion.aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950 text-white shadow-xl z-50 flex flex-col ${
          isMobileOpen ? "block" : "hidden md:block"
        }`}
        variants={sidebarVariants}
        animate={isExpanded ? "expanded" : "collapsed"}
        initial={false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Enhanced Logo and Header */}
        <motion.div 
          className="relative overflow-hidden h-24 px-3 border-b border-blue-700/40 flex items-center justify-between"
          initial="rest"
          whileHover="hover"
          variants={logoContainerVariants}
        >
          {/* Logo background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/0 via-blue-700/10 to-blue-500/30 backdrop-filter z-0"></div>
          
          <div
            className="flex items-center gap-3 cursor-pointer relative z-10"
            onClick={() => setIsModalOpen(true)}
          >
            <motion.div
              className="relative"
              variants={logoImageVariants}
              whileHover="hover"
            >
              {/* Glowing ring around logo */}
              <motion.div 
                className="absolute -inset-1 rounded-full bg-blue-400 opacity-50 blur-sm"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              
              {organization?.logo ? (
                <img
                  src={organization.logo}
                  alt="Organization Logo"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/50 relative z-10"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-300 flex items-center justify-center text-blue-900 font-bold text-xl relative z-10">
                  {organization?.name?.charAt(0) || "W"}
                </div>
              )}
            </motion.div>

            {isExpanded && (
              <motion.div
                className="flex flex-col"
                variants={logoTextVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3 }}
              >
                <motion.h2
                  className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
                >
                  {organization?.name || "Wekeyar"}
                </motion.h2>
                <motion.p 
                  className="text-xs text-blue-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Enterprise Dashboard
                </motion.p>
              </motion.div>
            )}
          </div>
          
          <motion.button
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-blue-700/80 hover:bg-blue-600 transition-colors relative z-10"
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </motion.button>
        </motion.div>

        {/* Navigation with enhanced staggered animations */}
        <nav className="p-3 space-y-1.5 mt-2 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent">
          <AnimatePresence>
            {filteredLinks.map(({ title, path, icon: Icon }, index) => (
              <motion.div
                key={path}
                custom={index}
                variants={linkContainerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20 }}
              >
                <motion.div
                  variants={itemVariants}
                  initial="initial"
                  whileHover="hover"
                  animate={activeHover === path ? "hover" : "initial"}
                  onHoverStart={() => {
                    setActiveHover(path);
                    setHoveredLink(path);
                  }}
                  onHoverEnd={() => {
                    setActiveHover(null);
                    setHoveredLink(null);
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    to={path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all overflow-hidden relative ${
                      isActivePath(path)
                        ? "bg-gradient-to-r from-white/90 to-blue-100/90 text-blue-800 font-semibold shadow-md"
                        : "hover:bg-blue-700/40"
                    }`}
                  >
                    {/* Active/hover indicator with animation */}
                    {(isActivePath(path) || hoveredLink === path) && !isActivePath(path) && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-300"
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    
                    <motion.div
                      whileHover={{ rotate: isActivePath(path) ? 0 : 10 }}
                      transition={{ duration: 0.2 }}
                      className={`${isActivePath(path) ? "text-blue-700" : ""}`}
                    >
                      <Icon size={20} />
                    </motion.div>
                    
                    <AnimatePresence mode="wait">
                      {isExpanded && (
                        <motion.span
                          variants={titleVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ duration: 0.2, delay: 0.05 }}
                          className={`whitespace-nowrap overflow-hidden text-sm font-medium`}
                        >
                          {title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Enhanced Logout Button with animation */}
          <motion.div
            variants={linkContainerVariants}
            custom={filteredLinks.length}
            initial="hidden"
            animate="visible"
            className="mt-4 pt-4 border-t border-blue-700/30"
          >
            <motion.button
              className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-all relative overflow-hidden ${
                isExpanded ? "bg-red-500/10 hover:bg-red-600/20" : "hover:bg-red-600/20"
              }`}
              onClick={handleLogout}
              whileHover={{ 
                scale: 1.03, 
                x: 5, 
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
            >
              {/* Animated glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-red-500/5"
                whileHover={{
                  backgroundImage: "radial-gradient(circle at center, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0) 70%)"
                }}
              />
              
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <LogOut size={20} className="text-red-400 relative z-10" />
              </motion.div>
              
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span
                    variants={titleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium text-red-300 relative z-10"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </nav>

        {/* New Footer Section */}
        <motion.div 
          className="mt-auto border-t border-blue-700/30 p-3"
          variants={footerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} px-2 py-2`}>
            {isExpanded ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-blue-300/80"
              >
                <p className="font-semibold">Powered by</p>
                <p className="text-blue-200">Nexys Infotech</p>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <ExternalLink size={16} className="text-blue-300/80" />
              </motion.div>
            )}
            
            {isExpanded && (
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ExternalLink size={16} className="text-blue-300/80" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.aside>

      {/* Organization Modal */}
      {isModalOpen && (
        <OrganizationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          organization={organization}
        />
      )}
    </>
  );
};

export default Sidebar;