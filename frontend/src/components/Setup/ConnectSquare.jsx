import React, { useState } from 'react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { ExternalLink, Key, MapPin, Webhook, CheckCircle, AlertCircle } from 'lucide-react';

const ConnectSquare = ({ isConnected, onConnectionChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    applicationId:
