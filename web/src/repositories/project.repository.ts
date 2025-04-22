import {
  IProject,
  IProjectActivity,
  ProjectModel,
} from '@/models/project.model';

export const ProjectRepository = {
  createProject: async (ProjectData: {
    teamName: string;
    teamNumber?: number;
    activities?: IProjectActivity[];
  }): Promise<IProject> => {
    return ProjectModel.create(ProjectData);
  },

  getProjectById: async (projectId: string): Promise<IProject | null> => {
    return ProjectModel.findOne({ _id: projectId }).lean();
  },

  getAllProjects: async (): Promise<IProject[]> => {
    return ProjectModel.find().lean();
  },
};
