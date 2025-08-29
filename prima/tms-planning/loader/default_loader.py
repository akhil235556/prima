from abc import ABC, abstractmethod

class DefaultLoader(ABC):

    @abstractmethod
    def file_upload(self, **kwargs):
        pass

    @abstractmethod
    def get_planning_listing(self, **kwargs):
        pass

    @abstractmethod
    def get_task_listing(self, **kwargs):
        pass

    @abstractmethod
    def get_routes_listing(self, **kwargs):
        pass

    @abstractmethod
    def get_result_listing(self, **kwargs):
        pass

    @abstractmethod
    def get_error_listing(self, **kwargs):
        pass

    @abstractmethod
    def get_output_file(self, **kwargs):
        pass

    @abstractmethod
    def get_indent_output_file(self, **kwargs):
        pass

    @abstractmethod
    def get_sample_file(self, **kwargs):
        pass