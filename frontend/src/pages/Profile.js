import React, { useState } from 'react';
import patients from '../static/patientprofile';

const Profile = () => {
    const patient = patients[0];
    const [expandedIndices, setExpandedIndices] = useState([]);

    const toggleExpand = (index) => {
        if (expandedIndices.includes(index)) {
            // Remove
            setExpandedIndices(expandedIndices.filter((i) => i !== index));
        } else {
            // Add
            setExpandedIndices([...expandedIndices, index]);
        }
    };

    return (
        <div className="max-w-screen-lg mx-auto p-6 space-y-6">
            {/* Personal Information Section */}
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <section className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="border-b pb-2 mb-2">
                    <h1 className="text-2xl font-bold text-blue-700"> {patient.name} </h1>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <li><strong>Age:</strong> {patient.age}</li>
                    <li><strong>Gender:</strong> {patient.gender}</li>
                    <li><strong>Weight:</strong> {patient.weight}</li>
                    <li><strong>Ethnicity:</strong> {patient.ethnicity}</li>
                </ul>
            </section>

            {/* Allergies, Drugs Alert, Medical Alert Section */}
            <section className="bg-white p-4 rounded-lg shadow-md">
                <div className="border-b pb-2 mb-2">
                    <h2 className="text-xl font-semibold mb-2">Alerts</h2>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <li><strong>Allergies:</strong> {patient.allergies}</li>
                    <li><strong>Drugs Alert:</strong> {patient.drugsAlert}</li>
                    <li><strong>Medical Alert:</strong> {patient.medicalAlert}</li>
                </ul>
            </section>

            {/* Lab Results, Admission Details, Medical History Section */}
            <section className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Medical Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="border-b pb-2 mb-2">
                            <h3 className="font-semibold">Admission Details</h3>
                        </div>
                        <p><strong>Reason:</strong> {patient.admissionReason}</p>
                        <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="border-b pb-2 mb-2">
                            <h3 className="font-semibold">Lab Results</h3>
                        </div>
                        <ul>
                            <li><strong>Total White Cell Count:</strong> {patient.labResults.TotalWhiteCellCount}</li>
                            <li><strong>CRP:</strong> {patient.labResults.CRP}</li>
                            <li><strong>Creatinine:</strong> {patient.labResults.Creatinine}</li>
                            <li><strong>Creatinine Clearance:</strong> {patient.labResults.CreatinineClearance}</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="border-b pb-2 mb-2">
                            <h3 className="font-semibold">Medical History</h3>
                        </div>
                        <ul>
                            {patient.medicalHistory.map((item, index) => {
                                return (
                                    <li key={index}><strong>{index + 1}.</strong> {item}</li>
                                )
                            }
                            )}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Medication Orders Section */}
            <section className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Current Medications</h2>
                <div className="space-y-4">
                    {patient.medicationOrders.map((medication, index) => (
                        <div key={index} className="border-b pb-2">
                            {/* Medication Name Header */}
                            <button
                                className="w-full flex justify-between items-center text-left font-semibold text-blue-600"
                                onClick={() => toggleExpand(index)}
                            >
                                {medication.medication}
                                <span className="text-xl">{expandedIndices.includes(index) ? "-" : "v"}</span>
                            </button>

                            {/* Expanded Content */}
                            {expandedIndices.includes(index) && (
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                    <ul>
                                        <li><strong>Route:</strong> {medication.route}</li>
                                        <li><strong>Dose:</strong> {medication.dose}</li>
                                        <li><strong>Frequency:</strong> {medication.frequency}</li>
                                        <li>
                                            <strong>Time:</strong>{" "}
                                            {Array.isArray(medication.time)
                                                ? medication.time.join(", ")
                                                : medication.time}
                                        </li>
                                        <li><strong>Start Date:</strong> {medication.startDate}</li>
                                        <li><strong>End Date:</strong> {medication.endDate}</li>
                                        <li><strong>Additional Instructions:</strong> {medication.additionalInstructions || "None provided"}</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div >
    );
};


export default Profile;