import React from "react";
import { motion } from "framer-motion";

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: {
    name: string;
    logo: string;
    employeeSize?: string;
    numberOfStores?: number;
    mainOfficeAddress?: string;
  } | null;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({
  isOpen,
  onClose,
  organization,
}) => {
  if (!isOpen || !organization) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Organization Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Organization Details */}
        <div className="flex flex-col items-center space-y-4">
          {organization.logo && (
            <img
              src={organization.logo}
              alt="Organization Logo"
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
          <h3 className="text-lg font-semibold text-gray-700">{organization.name}</h3>
          {organization.employeeSize && (
            <p className="text-sm text-gray-600">
              <strong>Employee Size:</strong> {organization.employeeSize}
            </p>
          )}
          {organization.numberOfStores && (
            <p className="text-sm text-gray-600">
              <strong>Number of Stores:</strong> {organization.numberOfStores}
            </p>
          )}
          {organization.mainOfficeAddress && (
            <p className="text-sm text-gray-600">
              <strong>Main Office:</strong> {organization.mainOfficeAddress}
            </p>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrganizationModal;