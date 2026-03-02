#pragma once
#ifndef SHADER_H
#define SHADER_H
//
#include<glad/glad.h>
#include<iostream>
#include<string>
#include<fstream>
#include<sstream>

//glm setup
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>

struct Material{
   glm::vec3 ambient;
   glm::vec3 diffuse;
   glm::vec3 specular;
   float shininess;

   Material(glm::vec3 amb, glm::vec3 diff, glm::vec3 spec, float shine)
        : ambient{amb}, diffuse{diff}, specular{spec}, shininess{shine}
    {
    }

};

struct spotLight {


   glm::vec3 direction;
   glm::vec3 position;
   glm::vec3 ambient;
   glm::vec3 diffuse;
   glm::vec3 specular;

   spotLight(glm::vec3 dir,glm::vec3 pos,glm::vec3 amb,glm::vec3 diff, glm::vec3 spec)
    :direction{dir},position{pos},ambient{amb},diffuse{diff},specular{spec}
   {

   }

};
struct pointLight{
   float constant;
   float linear;
   float quadratic;

   glm::vec3 position;
   glm::vec3 ambient;
   glm::vec3 diffuse;
   glm::vec3 specular;

   pointLight(float cons,float lin,float quad,glm::vec3 pos,glm::vec3 amb,glm::vec3 diff, glm::vec3 spec)
   :constant{cons},linear{lin},quadratic{quad},position{pos},ambient{amb},diffuse{diff},specular{spec}
   {

   }


};

class Shader {
public:
	unsigned int ID;
	Shader(const char* vertexPath, const char* fragPath);
	void use();
	void setBool(const std::string& name, bool value) const;
	void setInt(const std::string& name, int value) const;
	void setFloat(const GLuint location, float value) const;
    void setVec3(const GLuint location, glm::vec3 objColor) const;
	void setMat4(const GLuint location, GLboolean transpose , glm::mat4 matrix);
	void setMaterial(const Material& mat,GLuint location) const;
	void setSpotLight(const spotLight& spotlight,GLuint location) const;
    void setPointLight(const pointLight& pointLight,GLuint location);
private:
	void checkCompilationError(unsigned int shader, const std::string& type);
};


#endif
