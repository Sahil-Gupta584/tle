import { Code2 } from "lucide-react";
import Header from "./components/header";
import { StudentTable } from "./components/studentsTable";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Header
        leftElement={
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                CP Student Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Competitive Programming Progress Management
              </p>
            </div>
          </div>
        }
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <StudentTable />
      </div>
    </div>
  );
}
