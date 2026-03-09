#include <iostream>
#include <filesystem>
#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include<assimp/Importer.hpp>

#include "shaderClass.h"
#include "Camera.h"
#include "Debugger.h"
#include "model.h"


void processInput(GLFWwindow* window, float currentTime);
void mouse_callback(GLFWwindow* window, double xPos, double yPos);
void framebuffer_size_callback(GLFWwindow* window, int width, int height);
//gloabal variable intalization 
float lastFrame=0.0f;
float deltaTime;

//global intial states for the camera
glm::vec3 cameraPos= glm::vec3(0.0f,0.25f,6.0f);
glm::vec3 cameraUp = glm::vec3(0.0f,1.0f,0.0f);
//setting the intial state of the mouse to the center of the camera
float lastX = 400;
float lastY = 300;
//initial entry to true
bool firstEntry = true;
//first camera offsets 
float yaw = -90.0f;
float pitch = 0.0f;
//
Camera camera = Camera(cameraPos,cameraUp);


int main(){
    //intalize glfw 
    glfwInit();
    std::cout<<"Current working directory: "<< std::filesystem::current_path()<<std::endl;
    //specifying which version of opengl version we are using the minor and major 
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR,4); 
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR,3);
    //specfiying which profile it uses, set of functions 
    //we are only using modern functions only!!!
    glfwWindowHint(GLFW_OPENGL_PROFILE,GLFW_OPENGL_CORE_PROFILE);
    //for debugging from learnopengl.com
    glfwWindowHint(GLFW_OPENGL_DEBUG_CONTEXT, true);

    //now to the window itself 
    GLuint windowWidth=800;
    GLuint windowHeight=600;
    GLFWwindow *window = glfwCreateWindow(windowWidth,windowHeight,"test",NULL,NULL);
    if(window==NULL){
        std::cout<<"failed to open the window"<<std::endl;
        glfwTerminate();
        return -1;
    }
    //this line below is self explanitory 
    //context means an object that hold the whole of opengl
    glfwMakeContextCurrent(window);

    gladLoadGL();
    EnableModernDebugging();


    glViewport(0,0,windowWidth,windowHeight);
     
   
    
    Shader shaderProgram3("shaders/shader.vert","shaders/shader.frag");
    Shader shaderProgram2("shaders/lightsource.vert","shaders/lightsource.frag");
	

    glm::mat4 model=glm::mat4(1.0f);
    glm::mat4 objModel=glm::mat4(1.0f);
    glm::mat4 view = glm::mat4(1.0f);
    glm::mat4 projection;

    //light material 
   

    
     spotLight light=spotLight(
                     camera.Position,
                     camera.Front,
                     glm::vec3(0.2f,0.2f,0.2f),
                     glm::vec3(0.5f,0.5f,0.5f),
                     glm::vec3(1.0f,1.0f,1.0f));

     pointLight light1=pointLight(
        1.0f,0.009f,0.00032f,
        glm::vec3(0.0f,2.0f,0.0f),
        glm::vec3(0.1f,0.1f,0.1f),
        glm::vec3(0.7f,0.0f,0.0f),
        glm::vec3(1.0f,0.0f,0.0f));

    projection = glm::perspective(glm::radians(45.0f),(float)windowWidth/(float)windowHeight,0.1f,800.0f);
    //
    shaderProgram3.use();
    shaderProgram3.setMat4(2,GL_FALSE,projection);
    shaderProgram3.setPointLight(light1,20);


    shaderProgram2.use();
    shaderProgram2.setMat4(2,GL_FALSE,projection);
    objModel=glm::translate(objModel,glm::vec3(0.0f,0.0f,0.0f));
    objModel=glm::scale(objModel,glm::vec3(0.5f,0.5f,0.5f));
    shaderProgram2.setMat4(0,GL_FALSE,objModel);
    shaderProgram2.setVec3(3,glm::vec3(1.0f,0.0f,0.0f));
    

    glEnable(GL_DEPTH_TEST);
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
    glfwSetCursorPosCallback(window, mouse_callback);

    Model bunny("assets/model/scroll/scene.gltf");
    
    while(!glfwWindowShouldClose(window)){

        glClearColor(0.039f, 0.059f, 0.122f,0.3f);
        glClear(GL_COLOR_BUFFER_BIT|GL_DEPTH_BUFFER_BIT);
        processInput(window,glfwGetTime());
        view=camera.GetViewMatrix();
        
        shaderProgram3.use();
        light.direction=camera.Position;
        light.position=camera.Front;
        shaderProgram3.setSpotLight(light,10);
        shaderProgram3.setVec3(5,camera.Position);

       

        bunny.Draw(shaderProgram3,camera);


      
       
    
        
       
        glfwSwapBuffers(window);

        glfwPollEvents();

    }


    
    


    //terminate glfw 
    glfwTerminate();
    glfwDestroyWindow(window);

    return 0;
}
void processInput(GLFWwindow* window, float currentTime) {
    
    deltaTime =currentTime-lastFrame;
    lastFrame=currentTime;
    if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(window, true);
    //movement in z axis 
    if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
        camera.ProcessKeyboard(FORWARD, deltaTime);
    if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
        camera.ProcessKeyboard(BACKWARD, deltaTime);
    //movement in x axis
    if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
        camera.ProcessKeyboard(RIGHT, deltaTime);
    if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
        camera.ProcessKeyboard(LEFT, deltaTime);
}
void mouse_callback(GLFWwindow* window, double xPos, double yPos)
{
    const float sensitivity = 0.05f; // Reduced for touchpad
    if (firstEntry) {
        lastX = xPos;
        lastY = yPos;
        firstEntry = false;
        return;
    }
    float xChange = static_cast<float>(sensitivity * (xPos - lastX));
    float yChange = static_cast<float>(sensitivity * (lastY - yPos));
    lastX = xPos;
    lastY = yPos;
    //
    camera.ProcessMouseMovement(xChange, yChange);
    //
}
void framebuffer_size_callback(GLFWwindow* window, int width, int height){
  glViewport(0,0,width,height);
}